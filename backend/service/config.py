from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, EmailStr, SecretStr

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str
    MODEL_NAME: str = "facebook/bart-large-cnn"
    MAX_TEXT_LENGTH: int = 5000
    MAX_FILE_SIZE_MB: int = 10

    # Email config
    MAIL_USERNAME: str = Field(..., env="EMAIL_USER")
    MAIL_PASSWORD: SecretStr = Field(..., env="EMAIL_PASSWORD")
    MAIL_FROM: EmailStr = Field(..., env="EMAIL_FROM")
    MAIL_PORT: int = Field(587, env="EMAIL_PORT")
    MAIL_SERVER: str = Field(..., pattern=r"^smtp\..+", env="EMAIL_SERVER")
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_FROM_NAME: str = "My App"
    FRONTEND_URL: str = Field("http://localhost:5173", env="FRONTEND_URL")


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="forbid"
    )

settings = Settings()