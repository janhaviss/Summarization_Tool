from fastapi import APIRouter
from schemas import SummaryRequest
from service.summarizer import summarize_text

router = APIRouter()

@router.post("/summarize")
async def summarize(request: SummaryRequest):
    return {
        "summary": summarize_text(
            request.text,
            method=request.method if hasattr(request, "method") else "transformers"
        )
    }