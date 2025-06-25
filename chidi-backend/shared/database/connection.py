import os
from typing import Generator, Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import async dependencies only if available
try:
    from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
    ASYNC_AVAILABLE = True
except ImportError:
    ASYNC_AVAILABLE = False

from .models import Base

# For Alembic migrations and synchronous operations
DATABASE_URL = os.getenv("DATABASE_URL")

# Remove the postgres:// prefix if present (SQLAlchemy requires postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create sync engine for Alembic migrations and synchronous operations
sync_engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

# Create async engine for application use only if asyncpg is available
async_engine = None
AsyncSessionLocal = None

if ASYNC_AVAILABLE:
    try:
        # Get async database URL from environment variables (for Supabase connection)
        ASYNC_DATABASE_URL = os.environ.get(
            "DATABASE_URL", 
            DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
        )
        
        # Create async engine for application use
        async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=False)
        AsyncSessionLocal = sessionmaker(
            async_engine, class_=AsyncSession, expire_on_commit=False
        )
    except Exception as e:
        print(f"Warning: Could not create async database engine: {e}")
        # Fall back to sync engine for development/testing


async def get_db() -> Generator[AsyncSession, None, None]:
    """
    Dependency for FastAPI to get a database session.
    Usage:
        @app.get("/items/")
        async def read_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
