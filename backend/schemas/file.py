from pydantic import BaseModel,Field
from typing import Optional


class FileSummaryRequest(BaseModel):
    """Schema for file upload summary"""
    file_type: str = Field(..., example="pdf")
    # Note: Actual file handling done via FastAPI's UploadFile