from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    text: str
    # You can add more parameters like summary length later
    max_length: Optional[int] = None  # Example of optional parameter with default

class SummaryResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int
    reduction_ratio: float  # Will be calculated in the endpoint

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: SummarizeRequest) -> Dict[str, Any]:
    """
    Summarize the input text and return statistics about the summarization.
    
    Args:
        request: SummarizeRequest containing the text to summarize
        
    Returns:
        Dictionary containing:
        - summary: The summarized text
        - original_length: Length of original text
        - summary_length: Length of summary
        - reduction_ratio: Percentage of original length
        
    Raises:
        HTTPException: If summarization fails
    """
    try:
        # This is still a placeholder - replace with your actual summarization logic
        sentences = request.text.split('.')
        summary = '. '.join(sentences[:3]) + '.' if len(sentences) > 3 else request.text
        
        original_len = len(request.text)
        summary_len = len(summary)
        reduction = (1 - (summary_len / original_len)) * 100 if original_len > 0 else 0
        
        return {
            "summary": summary,
            "original_length": original_len,
            "summary_length": summary_len,
            "reduction_ratio": round(reduction, 2)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
