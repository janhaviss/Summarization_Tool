import io
import re
import asyncio
from typing import Union
from pathlib import Path
import tempfile
from fastapi import UploadFile, HTTPException, status
from schemas.summarization import SummaryRequest
import PyPDF2
from pptx import Presentation
import docx

class SummarizationService:
    def __init__(self):
        self.summarizer_pipeline = None
        self.model_loaded = False

    async def initialize(self):
        """Lazy loading of models"""
        if not self.model_loaded:
            await self._load_models()
            self.model_loaded = True

    async def _load_models(self):
        """Load summarization models"""
        try:
            from transformers import pipeline
            self.summarizer_pipeline = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device="cpu"
            )
        except ImportError as e:
            raise RuntimeError(f"Failed to load transformers: {str(e)}")

    async def summarize_content(
        self,
        content: Union[SummaryRequest, UploadFile],
        method: str = "transformers",
            **kwargs
        ) -> str:
            """
            Handle both text and file uploads for summarization
            """
            await self.initialize()

            # Handle text input
            if isinstance(content, SummaryRequest):
                return await self.summarize_text(content.text, method, **kwargs)
            
            # Handle file uploads (only if it's actually a file)
            elif isinstance(content, UploadFile):
                return await self.process_uploaded_file(content, method, **kwargs)
            
            # Handle invalid input
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid input type - must be text or file"
                )

    async def process_uploaded_file(
        self,
        file: UploadFile,
        method: str,
        **kwargs
    ) -> str:
        """Process uploaded files and extract text for summarization"""
        file_ext = Path(file.filename).suffix.lower()
        temp_file_path = None

        try:
            # Save to temp file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                contents = await file.read()
                temp_file.write(contents)
                temp_file_path = temp_file.name

            # Extract text based on file type
            if file_ext == '.pdf':
                text = await self.extract_text_from_pdf(temp_file_path)
            elif file_ext == '.docx':
                text = await self.extract_text_from_docx(temp_file_path)
            elif file_ext == '.pptx':
                text = await self.extract_text_from_pptx(temp_file_path)
            else:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="Unsupported file type"
                )

            # Clean and limit extracted text
            text = self.clean_text(text)
            if len(text.split()) > 5000:
                text = " ".join(text.split()[:5000])

            return await self.summarize_text(text, method, **kwargs)

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"File processing error: {str(e)}"
            )
        finally:
            if temp_file_path:
                Path(temp_file_path).unlink(missing_ok=True)

    async def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using async executor"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            self._sync_extract_pdf_text,
            file_path
        )

    def _sync_extract_pdf_text(self, file_path: str) -> str:
        """Synchronous PDF text extraction"""
        text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text

    async def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX using async executor"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            self._sync_extract_docx_text,
            file_path
        )

    def _sync_extract_docx_text(self, file_path: str) -> str:
        """Synchronous DOCX text extraction"""
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])

    async def extract_text_from_pptx(self, file_path: str) -> str:
        """Extract text from PPTX using async executor"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            self._sync_extract_pptx_text,
            file_path
        )

    def _sync_extract_pptx_text(self, file_path: str) -> str:
        """Synchronous PPTX text extraction"""
        prs = Presentation(file_path)
        text = []
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text.append(shape.text)
        return "\n".join(text)

    def clean_text(self, text: str) -> str:
        """Clean extracted text"""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s.,;:!?()-]', '', text)
        return text.strip()

    async def summarize_text(
        self,
        text: str,
        method: str = "transformers",
        max_length: int = 130,
        min_length: int = 30,
        sentences_count: int = 3
    ) -> str:
        """Core summarization logic"""
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No text content found"
            )

        try:
            if method == "transformers":
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None,
                    lambda: self.summarizer_pipeline(
                        text,
                        max_length=max_length,
                        min_length=min_length,
                        do_sample=False
                    )
                )
                return result[0]["summary_text"]
            else:
                return await self._sumy_summarize(text, sentences_count)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Summarization failed: {str(e)}"
            )

    async def _sumy_summarize(self, text: str, sentences_count: int) -> str:
        """Async wrapper for sumy summarization"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            self._sync_sumy_summarize,
            text,
            sentences_count
        )

    def _sync_sumy_summarize(self, text: str, sentences_count: int) -> str:
        """Synchronous sumy implementation"""
        from sumy.parsers.plaintext import PlaintextParser
        from sumy.nlp.tokenizers import Tokenizer
        from sumy.summarizers.lsa import LsaSummarizer
        
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LsaSummarizer()
        summary = summarizer(parser.document, sentences_count)
        return " ".join(str(sentence) for sentence in summary)


# Singleton instance for the service
summarization_service = SummarizationService()