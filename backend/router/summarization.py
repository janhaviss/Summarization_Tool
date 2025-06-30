from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi.security import HTTPBearer
from schemas.summarization import SummaryRequest, TextSummaryResponse, FileSummaryResponse, FileMetadata
from models.user import User
from typing import Optional, Dict, Tuple
from database import get_db
from sqlalchemy.orm import Session
from service.auth import get_current_user_optional
from datetime import datetime, date
import logging
from service.summarizer import summarization_service


router = APIRouter(tags=["Summarization"])
security = HTTPBearer(auto_error=False)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Guest usage config
guest_usage: Dict[Tuple[str, date], int] = {}
GUEST_DAILY_LIMIT = 5
MAX_GUEST_TEXT_LENGTH = 5000
MAX_FILE_SIZE_MB = 10

def check_guest_limits(ip: str) -> Tuple[bool, int]:
    try:
        today = datetime.now().date()
        key = (ip, today)
        current = guest_usage.get(key, 0)
        if current >= GUEST_DAILY_LIMIT:
            return False, 0
        guest_usage[key] = current + 1
        return True, GUEST_DAILY_LIMIT - (current + 1)
    except Exception as e:
        logger.error(f"Guest limit check failed: {e}")
        return False, 0

async def validate_text_content(text: str, is_guest: bool, client_host: str) -> Tuple[int, Optional[int], Optional[str]]:
    if not text.strip():
        return 0, None, "Text cannot be empty"
    
    char_count = len(text)
    remaining = None

    if is_guest:
        if char_count > MAX_GUEST_TEXT_LENGTH:
            return char_count, None, f"Guest limit: {MAX_GUEST_TEXT_LENGTH} characters max"
        allowed, remaining = check_guest_limits(client_host)
        if not allowed:
            return char_count, None, f"Daily limit reached ({GUEST_DAILY_LIMIT} summaries)"
    
    return char_count, remaining, None

async def validate_file_content(file: UploadFile, is_guest: bool, client_host: str) -> Tuple[Optional[int], Optional[str]]:
    remaining = None
    if is_guest:
        allowed, remaining = check_guest_limits(client_host)
        if not allowed:
            return None, f"Daily limit reached ({GUEST_DAILY_LIMIT} summaries)"
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            return None, f"File too large. Max {MAX_FILE_SIZE_MB}MB allowed"
    return remaining, None

async def handle_premium_user(user: User, db: Session) -> Dict:
    try:
        if user.credits <= 0:
            raise HTTPException(status_code=402, detail="No credits remaining. Please top up.")
        user.credits -= 1
        db.commit()
        return {
            "premium": True,
            "remaining_credits": user.credits,
            "max_text_length": "Unlimited"
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update user credits: {e}")
        raise HTTPException(status_code=500, detail="Failed to process your request")

@router.post("/text", response_model=TextSummaryResponse, summary="Summarize text input (guest access allowed)")
async def summarize_text(
    request: Request,
    summary_request: SummaryRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    try:
        await summarization_service.initialize()

        is_guest = user is None
        client_host = request.client.host
        char_count, remaining, error = await validate_text_content(summary_request.text, is_guest, client_host)
        if error:
            raise HTTPException(status_code=400 if "limit" in error else 422, detail=error)

        response_data = {
            "summary": "",
            "is_guest": is_guest,
            "characters_processed": char_count,
            "premium": False,
            "remaining_uses": remaining,
            "remaining_credits": None,
            "success": False,
            "processing_time_ms": None,
            "method_used": summary_request.method,
            "compression_ratio": summary_request.compression_ratio or 0.3
        }

        if not is_guest:
            response_data.update(await handle_premium_user(user, db))

        # summary = await summarization_service.summarize_text(
        #     text=summary_request.text,
        #     method=summary_request.method,
        #     max_length=130,
        #     min_length=30
        # )

        summary = await summarization_service.summarize_text(
            summary_request.text,
            method=summary_request.method,
            tone=summary_request.tone
        )

        response_data["summary"] = summary
        response_data["success"] = True
        return response_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Text summarization failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Text summarization failed")

@router.post("/file", response_model=FileSummaryResponse, summary="Summarize file upload (guest access allowed)")
async def summarize_file(
    request: Request,
    file: UploadFile,
    method: str = "transformers",  # optionally make this dynamic via form-data
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    try:
        await summarization_service.initialize()

        is_guest = user is None
        client_host = request.client.host
        remaining, error = await validate_file_content(file, is_guest, client_host)
        if error:
            raise HTTPException(status_code=400, detail=error)

        response_data = {
            "summary": "",
            "is_guest": is_guest,
            "characters_processed": 0,
            "premium": False,
            "remaining_uses": remaining,
            "remaining_credits": None,
            "success": False,
            "processing_time_ms": None,
            "file_metadata": FileMetadata(
                filename=file.filename,
                content_type=file.content_type,
                size_kb=round(len(await file.read()) / 1024, 2),
                pages=None,
                word_count=None,
                language=None
            ),
            "method_used": method,
            "compression_ratio": 0.3
        }
        file.file.seek(0)  # reset pointer after size read

        if not is_guest:
            response_data.update(await handle_premium_user(user, db))

        summary = await summarization_service.process_uploaded_file(file, method=method)
        response_data["summary"] = summary
        response_data["success"] = True
        response_data["characters_processed"] = len(summary)
        return response_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File summarization failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="File summarization failed")
