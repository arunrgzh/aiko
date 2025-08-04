from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool

from .config import settings

# Create declarative base
Base = declarative_base()

# Create async engine only if database_url is provided
def get_engine():
    if not settings.database_url:
        raise ValueError("DATABASE_URL not configured")
    return create_async_engine(
        settings.database_url,
        future=True,
        poolclass=NullPool,
    )

# Create global engine instance only when database URL is available
_engine = None

def get_or_create_engine():
    global _engine
    if _engine is None:
        _engine = get_engine()
    return _engine

# Initialize engine only if DATABASE_URL is configured
try:
    engine = get_or_create_engine()
except ValueError:
    # Engine will be None if DATABASE_URL is not configured
    engine = None

# Create async session factory
def get_session_factory():
    if engine is None:
        raise ValueError("Database engine not initialized. Check DATABASE_URL configuration.")
    return async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

# Create global async_session factory only if engine is available
try:
    async_session = get_session_factory()
except ValueError:
    async_session = None

# Dependency for database sessions
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    if async_session is None:
        raise ValueError("Database session not initialized. Check DATABASE_URL configuration.")
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close() 