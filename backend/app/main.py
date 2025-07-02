from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .api import auth, onboarding, assistants, notifications
from .api import settings as settings_api
from .database import engine, Base, async_session
from .models.assistant import Assistant
from .models.user import User
from .config import settings

# Create FastAPI app
app = FastAPI(
    title="AI-Komek API",
    description="Backend API for AI-Komek application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(assistants.router)
app.include_router(notifications.router)
app.include_router(settings_api.router)

# async def create_default_assistants():
#     """Создает дефолтных ассистентов для всех пользователей"""
#     # TODO: Fix async session handling
#     pass

@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # TODO: Fix async session for creating default assistants
    # await create_default_assistants()

@app.get("/")
async def root():
    return {"message": "Welcome to AI-Komek API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.environment
    } 