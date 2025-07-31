from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .api import auth, onboarding, assistants, notifications, hh_auth, assessment, jobs, enhanced_jobs
# TODO: Add hh_parser after fixing encoding issues
from .api import settings as settings_api
from .database import engine, Base, async_session
from .models.assistant import Assistant
from .models.user import User
from .config import settings

# Create FastAPI app
app = FastAPI(
    title="AI-Komekshi API",
    description="Backend API for AI-Komekshi application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add CORS middleware
# in your settings.py or wherever you load ENV
# settings.frontend_url = "https://ai-komekshi.site"  (in production)

origins = [
    "http://localhost:3000",      # local dev
    "http://127.0.0.1:3000",      # local dev
    settings.frontend_url,        # e.g. https://ai-komekshi.site in prod
]

app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["http://REDACTED:3000", "http://127.0.0.1:3000", "http://REDACTED:3000", settings.frontend_url],
=======
    allow_origins=origins,
>>>>>>> 3abd56210396aa4ab1007ed780052fdf73c363e5
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(assessment.router)
app.include_router(assistants.router)
app.include_router(notifications.router)
app.include_router(settings_api.router)
app.include_router(jobs.router)  # Personalized job recommendations

# Include HeadHunter routers
app.include_router(hh_auth.router)  # OAuth авторизация
# app.include_router(hh_parser.router)  # TODO: Добавить после исправления файла

# Include Enhanced Job Recommendation routers
app.include_router(enhanced_jobs.router)  # Enhanced dual recommendation system

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
    return {"message": "Welcome to AI-Komekshi API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.environment
    } 