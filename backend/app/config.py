from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Redis
    redis_url: Optional[str] = None

    # Frontend
    frontend_url: str = "http://localhost:3000"

    # Azure OpenAI API (используем ваши переменные из azure_test.py)
    azure_openai_api_key: Optional[str] = None
    azure_openai_base_url: Optional[str] = None  # Изменено с endpoint
    azure_openai_api_version: Optional[str] = None
    azure_openai_deployment_name: str = "gpt-4o"  # Ваш deployment
    azure_openai_max_tokens: int = 4096
    azure_openai_temperature: float = 0.2

    # Environment
    environment: str = "development"
    debug: bool = True

    model_config = SettingsConfigDict(
        env_file = ".env",
        env_file_encoding = "utf-8",
        extra = "ignore"   # or "forbid" if you want to catch any unexpected keys
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
