from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .api import auth, onboarding, assistants
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
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(assistants.router)

async def create_default_assistants():
    """Создает дефолтных ассистентов для всех пользователей"""
    async with async_session() as session:
        try:
            # Получаем всех пользователей, у которых нет ассистентов
            result = await session.execute(
                select(User)
                .outerjoin(Assistant)
                .where(Assistant.id == None)
            )
            users_without_assistants = result.scalars().all()
            
            for user in users_without_assistants:
                # Создаем дефолтного ассистента
                default_assistant = Assistant(
                    user_id=user.id,
                    name="AI Помощник по поиску работы",
                    description="Ваш персональный AI-ассистент для поиска работы и карьерного консультирования",
                    model="gpt-4o",  # Ваш Azure deployment name
                    system_prompt="Ты - профессиональный консультант по карьере и поиску работы. Помогай пользователям находить подходящие вакансии, составлять резюме и готовиться к собеседованиям.",
                    temperature="0.7",
                    max_tokens=4096,  # Увеличили лимит для GPT-4o
                    is_active=True
                )
                session.add(default_assistant)
            
            await session.commit()
        except Exception as e:
            await session.rollback()
            print(f"Error creating default assistants: {e}")
        finally:
            await session.close()

@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Создаем дефолтных ассистентов после создания таблиц
    await create_default_assistants()

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