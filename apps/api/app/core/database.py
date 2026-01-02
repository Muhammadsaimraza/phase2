from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from .config import settings


def get_database_url() -> str:
    """Convert DATABASE_URL to async format if needed."""
    url = settings.DATABASE_URL
    # Neon requires asyncpg driver for async operations
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


# Neon serverless PostgreSQL configuration
# Using NullPool because Neon handles connection pooling server-side
engine = create_async_engine(
    get_database_url(),
    echo=settings.DEBUG,
    future=True,
    # Neon pooler handles connection pooling, so we use NullPool
    # to avoid client-side pooling conflicts
    poolclass=NullPool,
    # Connection arguments for Neon
    connect_args={
        "ssl": "require",
        # Statement timeout (30 seconds)
        "command_timeout": 30,
    },
)

async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncSession:  # type: ignore
    """Dependency for getting async database sessions."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def check_db_connection() -> bool:
    """Test database connection."""
    from sqlalchemy import text

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            return True
    except Exception:
        return False
