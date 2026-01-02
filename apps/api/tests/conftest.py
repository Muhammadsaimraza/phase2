import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_session
from app.middleware import limiter
from app.models import User, Session as UserSession, Todo  # Import models for metadata

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create engine with StaticPool for connection sharing
engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="function")
async def setup_database():
    """Set up and tear down database tables for each test."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest.fixture(scope="function")
def client(setup_database):
    """Create a test client with session override."""
    # Reset rate limiter storage before each test
    limiter.reset()

    async def override_get_session():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# Test data helpers
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "SecurePass123"


@pytest.fixture
def test_user_data():
    """Valid user registration data."""
    return {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD,
    }


@pytest.fixture
def registered_user(client, test_user_data):
    """Create and return a registered user."""
    response = client.post("/api/v1/auth/register", json=test_user_data)
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def auth_tokens(client, test_user_data, registered_user):
    """Get auth tokens for a registered user."""
    response = client.post("/api/v1/auth/login", json=test_user_data)
    assert response.status_code == 200
    return response.json()


@pytest.fixture
def auth_headers(auth_tokens):
    """Get authorization headers with valid access token."""
    return {"Authorization": f"Bearer {auth_tokens['access_token']}"}
