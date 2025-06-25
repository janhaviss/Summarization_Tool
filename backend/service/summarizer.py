from typing import Optional
import logging
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from transformers import pipeline, Pipeline

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Summarizer:
    def __init__(self, method: str = "transformers"):
        """
        Initialize summarizer with either 'transformers' (default) or 'sumy'
        
        Args:
            method: 'transformers' for BART model or 'sumy' for lightweight LSA
        """
        self.method = method
        self.transformers_model: Optional[Pipeline] = None
        
        if method == "transformers":
            try:
                self._load_transformers_model()
            except Exception as e:
                logger.error(f"Failed to load transformers model: {e}")
                raise

    def _load_transformers_model(self):
        """Lazy-load the transformers model to save memory"""
        if not self.transformers_model:
            self.transformers_model = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device="cpu"  # Change to "cuda" if using GPU
            )

    def summarize(
        self,
        text: str,
        max_length: int = 130,
        min_length: int = 30,
        num_sentences: int = 3
    ) -> str:
        """
        Summarize text using the configured method
        
        Args:
            text: Input text to summarize
            max_length: Max tokens for transformers (ignored for sumy)
            min_length: Min tokens for transformers (ignored for sumy)
            num_sentences: Number of sentences for sumy (ignored for transformers)
            
        Returns:
            str: Generated summary
        """
        if not text.strip():
            raise ValueError("Input text cannot be empty")
            
        try:
            if self.method == "transformers":
                return self._transformers_summary(text, max_length, min_length)
            else:
                return self._sumy_summary(text, num_sentences)
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            raise RuntimeError(f"Summarization error: {str(e)}")

    def _transformers_summary(
        self,
        text: str,
        max_length: int,
        min_length: int
    ) -> str:
        """Generate summary using HuggingFace transformers"""
        if len(text.split()) < 50:  # Very short text
            return text[:max_length] + "..." if len(text) > max_length else text
            
        result = self.transformers_model(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
            truncation=True
        )
        return result[0]["summary_text"]

    def _sumy_summary(self, text: str, sentences_count: int) -> str:
        """Generate summary using sumy's LSA algorithm"""
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LsaSummarizer()
        summary = summarizer(parser.document, sentences_count)
        return " ".join(str(sentence) for sentence in summary)

# Default instance (can be imported directly)
default_summarizer = Summarizer(method="transformers")

# Helper function for backward compatibility
def summarize_text(
    text: str,
    method: str = "transformers",
    **kwargs
) -> str:
    """
    One-line summary function
    
    Example:
        summary = summarize_text("long text...", method="sumy", num_sentences=2)
    """
    return Summarizer(method).summarize(text, **kwargs)