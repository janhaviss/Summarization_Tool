from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, Form
from fastapi.security import HTTPBearer
from schemas import SummaryRequest
from models.user import User
from typing import Optional, Dict, Tuple, Union
from database import get_db
from sqlalchemy.orm import Session
from service.auth import get_current_user_optional
from datetime import datetime, date
import logging
from service.summarizer import summarization_service

router = APIRouter(tags=["Summarization"])
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for guest usage tracking
guest_usage: Dict[Tuple[str, date], int] = {}  # (ip, date) -> count

# Guest user limits
GUEST_DAILY_LIMIT = 5
MAX_GUEST_TEXT_LENGTH = 5000
MAX_FILE_SIZE_MB = 10

def check_guest_limits(ip: str) -> Tuple[bool, int]:
    """Check and update guest usage, returns (allowed, remaining)"""
    try:
        today = datetime.now().date()
        key = (ip, today)
        
        current = guest_usage.get(key, 0)
        if current >= GUEST_DAILY_LIMIT:
            return False, 0
        
        guest_usage[key] = current + 1
        return True, GUEST_DAILY_LIMIT - (current + 1)
    except Exception as e:
        logger.error(f"Error in check_guest_limits: {str(e)}")
        return False, 0

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi.security import HTTPBearer
from schemas import SummaryRequest
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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for guest usage tracking
guest_usage: Dict[Tuple[str, date], int] = {}  # (ip, date) -> count

# Guest user limits
GUEST_DAILY_LIMIT = 5
MAX_GUEST_TEXT_LENGTH = 5000
MAX_FILE_SIZE_MB = 10  # 10MB max file size

def check_guest_limits(ip: str) -> Tuple[bool, int]:
    """Check and update guest usage, returns (allowed, remaining)"""
    try:
        today = datetime.now().date()
        key = (ip, today)
        
        current = guest_usage.get(key, 0)
        if current >= GUEST_DAILY_LIMIT:
            return False, 0
        
        guest_usage[key] = current + 1
        return True, GUEST_DAILY_LIMIT - (current + 1)
    except Exception as e:
        logger.error(f"Error in check_guest_limits: {str(e)}")
        return False, 0

async def validate_text_content(text: str, is_guest: bool, client_host: str) -> Tuple[int, Optional[int], Optional[str]]:
    """Validate text content and return (char_count, remaining_uses, error)"""
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
    """Validate file content and return (remaining_uses, error)"""
    remaining = None
    
    if is_guest:
        allowed, remaining = check_guest_limits(client_host)
        if not allowed:
            return None, f"Daily limit reached ({GUEST_DAILY_LIMIT} summaries)"
        
        # Check file size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            return None, f"File too large. Max {MAX_FILE_SIZE_MB}MB allowed"
    
    return remaining, None

async def handle_premium_user(user: User, db: Session) -> Dict:
    """Handle premium user credit deduction"""
    try:
        if user.credits <= 0:
            raise HTTPException(
                status_code=402,
                detail="No credits remaining. Please top up."
            )
        
        user.credits -= 1
        db.commit()
        return {
            "premium": True,
            "remaining_credits": user.credits,
            "max_text_length": "Unlimited"
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update user credits: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process your request"
        )

@router.post("/text", summary="Summarize text input (guest access allowed)")
async def summarize_text(
    request: Request,
    summary_request: SummaryRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Endpoint specifically for text input"""
    try:
        # Initialize result structure
        result = {
            "summary": "",
            "is_guest": user is None,
            "characters_used": 0,
            "premium": False,
            "remaining_uses": None,
            "max_text_length": None,
            "success": False
        }

        # Validate text content
        char_count, remaining, error = await validate_text_content(
            summary_request.text,
            user is None,
            request.client.host
        )
        
        if error:
            raise HTTPException(
                status_code=400 if "limit" in error else 422,
                detail=error
            )
        
        result["characters_used"] = char_count
        if user is None:
            result.update({
                "remaining_uses": remaining,
                "max_text_length": MAX_GUEST_TEXT_LENGTH
            })

        # Handle premium users
        if user is not None:
            result.update(await handle_premium_user(user, db))

        # Generate summary
        summary = await summarization_service.summarize_text(
            summary_request.text,
            method="transformers"
        )
        
        if not summary or not isinstance(summary, str):
            raise ValueError("Invalid summary generated")
            
        result.update({
            "summary": summary,
            "success": True
        })
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Text summarization failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Text summarization failed: {str(e)}"
        )

@router.post("/file", summary="Summarize file upload (guest access allowed)")
async def summarize_file(
    request: Request,
    file: UploadFile,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Endpoint specifically for file uploads"""
    try:
        # Initialize result structure
        result = {
            "summary": "",
            "is_guest": user is None,
            "characters_used": 0,
            "premium": False,
            "remaining_uses": None,
            "max_text_length": None,
            "success": False,
            "file_metadata": {
                "filename": file.filename,
                "content_type": file.content_type
            }
        }

        # Validate file content
        remaining, error = await validate_file_content(
            file,
            user is None,
            request.client.host
        )
        
        if error:
            raise HTTPException(status_code=400, detail=error)
        
        if user is None:
            result.update({
                "remaining_uses": remaining,
                "max_text_length": MAX_GUEST_TEXT_LENGTH
            })

        # Handle premium users
        if user is not None:
            result.update(await handle_premium_user(user, db))

        # Generate summary
        summary = await summarization_service.process_uploaded_file(
            file,
            method="transformers"
        )
        
        if not summary or not isinstance(summary, str):
            raise ValueError("Invalid summary generated")
            
        result.update({
            "summary": summary,
            "characters_used": len(summary),  # Count of processed characters
            "success": True
        })
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File summarization failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"File summarization failed: {str(e)}"
        )