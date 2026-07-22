from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    app_name: str = "Processing AI Service"
    app_version: str = "1.0.0"
    debug: bool = True

    # Groq
    groq_api_key: str
    model_name: str = "llama-3.3-70b-versatile"
    temperature: float = 0.0

    # Redis
    redis_url: str = "redis://redis:6379/0"

    # Celery
    broker_url: str = "redis://redis:6379/0"
    result_backend: str = "redis://redis:6379/0"

    # Processing
    chunk_size: int = 1200
    chunk_overlap: int = 200


settings = Settings()