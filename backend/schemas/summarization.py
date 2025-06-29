from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Union
from enum import Enum

class SummarizationMethod(str, Enum):
    TRANSFORMERS = "transformers"
    SUMY = "sumy"
    BART = "bart"
    T5 = "t5"

class SummaryRequest(BaseModel):
    """
    Schema for text summarization requests
    Example:
    {
        "text": "The Indian government has launched...",
        "method": "transformers"
    }
    """
    text: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="Text content to summarize (10-10,000 characters)",
        example="The Indian government has launched new digital literacy programs..."
    )
    method: SummarizationMethod = Field(
        SummarizationMethod.TRANSFORMERS,
        description="Summarization algorithm to use",
        example="transformers"
    )
    compression_ratio: Optional[float] = Field(
        0.3,
        ge=0.1,
        le=0.8,
        description="Ratio of summary length to original text (0.1-0.8)",
        example=0.4
    )

class FileSummaryRequest(BaseModel):
    """
    Schema for file upload summarization
    Example:
    {
        "method": "transformers",
        "compression_ratio": 0.3
    }
    """
    method: SummarizationMethod = Field(
        SummarizationMethod.TRANSFORMERS,
        description="Summarization algorithm to use"
    )
    compression_ratio: Optional[float] = Field(
        0.3,
        ge=0.1,
        le=0.8,
        description="Ratio of summary length to original text"
    )

class FileMetadata(BaseModel):
    """
    Metadata about processed files
    Example:
    {
        "filename": "report.pdf",
        "content_type": "application/pdf",
        "size_kb": 245,
        "pages": 10,
        "word_count": 3500
    }
    """
    filename: str
    content_type: str
    size_kb: float
    pages: Optional[int]
    word_count: Optional[int]
    language: Optional[str]

class BaseSummaryResponse(BaseModel):
    """
    Standard response format for summarization
    Example:
    {
        "summary": "The government launched...",
        "is_guest": false,
        "characters_processed": 1200,
        "premium": true,
        "remaining_credits": 15,
        "success": true
    }
    """
    summary: str
    is_guest: bool
    characters_processed: int
    premium: bool
    remaining_uses: Optional[int]
    remaining_credits: Optional[int]
    success: bool
    processing_time_ms: Optional[float]

class TextSummaryResponse(BaseSummaryResponse):
    """
    Response for text summarization
    Inherits all fields from BaseSummaryResponse
    """
    method_used: SummarizationMethod
    compression_ratio: float

class FileSummaryResponse(BaseSummaryResponse):
    """
    Response for file summarization
    Example:
    {
        "summary": "The document discusses...",
        "file_metadata": {
            "filename": "report.pdf",
            "size_kb": 245,
            "pages": 10
        },
        ...
    }
    """
    file_metadata: FileMetadata
    method_used: SummarizationMethod
    compression_ratio: float

class ErrorResponse(BaseModel):
    """
    Standard error response
    Example:
    {
        "error": "invalid_text_length",
        "message": "Text must be between 10-10000 characters",
        "details": {
            "min_length": 10,
            "max_length": 10000
        }
    }
    """
    error: str
    message: str
    details: Optional[dict]