from typing import Optional
import logging
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Summarizer:
    def __init__(self, method: str = "auto"):
        """
        Initialize summarizer with either:
        - 'transformers' for BART model
        - 'sumy' for lightweight LSA
        - 'auto' (default): tries transformers first, falls back to sumy
        """
        self.method = method
        self.transformers_model = None
        
        if method == "transformers" or method == "auto":
            try:
                from transformers import pipeline  # Lazy import
                self._load_transformers_model()
                self.method = "transformers"
                logger.info("Successfully loaded transformers model")
            except ImportError:
                if method == "transformers":
                    raise RuntimeError("Transformers require PyTorch/TensorFlow. Install with: pip install torch")
                logger.warning("PyTorch/TensorFlow not found. Falling back to sumy")
                self.method = "sumy"
            except Exception as e:
                logger.error(f"Transformers initialization failed: {e}")
                if method == "transformers":
                    raise
                self.method = "sumy"

    def _load_transformers_model(self):
        """Lazy-load the transformers model"""
        from transformers import pipeline
        self.transformers_model = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            device="cpu"
        )

    def summarize(self, text: str, **kwargs) -> str:
        """Unified summarization interface"""
        if not text.strip():
            raise ValueError("Input text cannot be empty")
            
        try:
            if self.method == "transformers":
                return self._transformers_summary(text, **kwargs)
            return self._sumy_summary(text, **kwargs)
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            raise RuntimeError(f"Summarization error: {str(e)}")

    def _transformers_summary(self, text: str, max_length: int = 130, min_length: int = 30, **kwargs) -> str:
        """Generate summary using HuggingFace transformers"""
        if len(text.split()) < 30:
            return text[:max_length] + ("..." if len(text) > max_length else "")
            
        result = self.transformers_model(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
            truncation=True,
            **kwargs
        )
        return result[0]["summary_text"]

    def _sumy_summary(self, text: str, sentences_count: int = 3, **kwargs) -> str:
        """Generate summary using sumy's LSA algorithm"""
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LsaSummarizer()
        summary = summarizer(parser.document, sentences_count)
        return " ".join(str(sentence) for sentence in summary)

# Default instance with auto-fallback
default_summarizer = Summarizer(method="auto")

def summarize_text(text: str, method: str = "auto", **kwargs) -> str:
    """One-line summary function with auto-fallback"""
    return Summarizer(method).summarize(text, **kwargs)