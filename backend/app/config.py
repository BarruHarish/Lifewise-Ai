import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "LifeWise AI Advisory Platform"
    API_V1_STR: str = "/api"
    # Local fallback sqlite or PostgreSQL URI
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./lifewise.db")
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]

settings = Settings()
