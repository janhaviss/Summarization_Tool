from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class SummaryTone(str, Enum):
    FORMAL = "formal"
    CASUAL = "casual"
    BULLET = "bullet"

class SummarizationMethod(str, Enum):
    TRANSFORMERS = "transformers"
    SUMY = "sumy"

class SummaryRequest(BaseModel):
    """
    Schema for text summarization request.
    """
    text: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="Text content to summarize (between 10 to 10,000 characters)",
        example="The Indian government has launched new digital literacy programs to boost rural innovation..."
    )
    method: SummarizationMethod = Field(
        SummarizationMethod.TRANSFORMERS,
        description="Summarization method to use (e.g., transformers or sumy)",
        example="transformers"
    )
    compression_ratio: Optional[float] = Field(
        0.3,
        ge=0.1,
        le=0.8,
        description="Optional: Ratio of summary length to original text (used in future)",
        example=0.4
    )
    tone: Optional[SummaryTone] = SummaryTone.FORMAL  


class FileSummaryRequest(BaseModel):
    """
    Schema for summarization via file upload.
    """
    method: SummarizationMethod = Field(
        SummarizationMethod.TRANSFORMERS,
        description="Summarization method to use (e.g., transformers or sumy)",
        example="transformers"
    )
    compression_ratio: Optional[float] = Field(
        0.3,
        ge=0.1,
        le=0.8,
        description="Optional: Ratio of summary length to original text",
        example=0.4
    )

class FileMetadata(BaseModel):
    """
    Metadata about uploaded/processed file.
    """
    filename: str
    content_type: str
    size_kb: float
    pages: Optional[int] = None
    word_count: Optional[int] = None
    language: Optional[str] = None

class BaseSummaryResponse(BaseModel):
    """
    Base structure for all summary responses.
    """
    summary: str
    is_guest: bool
    characters_processed: int
    premium: bool
    remaining_uses: Optional[int] = None
    remaining_credits: Optional[int] = None
    success: bool
    processing_time_ms: Optional[float] = None

class TextSummaryResponse(BaseSummaryResponse):
    """
    Response for text-based summarization.
    """
    method_used: SummarizationMethod
    compression_ratio: float

class FileSummaryResponse(BaseSummaryResponse):
    """
    Response for file-based summarization, includes file metadata.
    """
    file_metadata: FileMetadata
    method_used: SummarizationMethod
    compression_ratio: float

class ErrorResponse(BaseModel):
    """
    Standard error response format.
    """
    error: str
    message: str
    details: Optional[dict] = None


