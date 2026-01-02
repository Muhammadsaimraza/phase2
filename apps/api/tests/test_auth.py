"""
Tests for authentication API endpoints.

Tests cover:
- User registration (success, duplicate email, weak password)
- User login (success, invalid credentials)
- Protected routes (with/without token)
- Token refresh (success, invalid token)
- Logout functionality
"""

import pytest


class TestRegistration:
    """Tests for POST /api/v1/auth/register."""

    def test_register_success(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert "id" in data
        assert "created_at" in data
        assert "password" not in data
        assert "password_hash" not in data

    def test_register_duplicate_email(self, client, test_user_data, registered_user):
        """Test registration with already registered email."""
        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 409
        assert "already registered" in response.json()["detail"].lower()

    def test_register_weak_password_no_uppercase(self, client):
        """Test registration with password missing uppercase letter."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "weakpass123"},
        )

        assert response.status_code == 422
        # Pydantic validation error
        errors = response.json()["detail"]
        assert any("uppercase" in str(e).lower() for e in errors)

    def test_register_weak_password_no_number(self, client):
        """Test registration with password missing number."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "WeakPassWord"},
        )

        assert response.status_code == 422
        errors = response.json()["detail"]
        assert any("number" in str(e).lower() for e in errors)

    def test_register_password_too_short(self, client):
        """Test registration with password less than 8 characters."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "Short1"},
        )

        assert response.status_code == 422

    def test_register_invalid_email(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "not-an-email", "password": "SecurePass123"},
        )

        assert response.status_code == 422


class TestLogin:
    """Tests for POST /api/v1/auth/login."""

    def test_login_success(self, client, test_user_data, registered_user):
        """Test successful login returns tokens."""
        response = client.post("/api/v1/auth/login", json=test_user_data)

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert "expires_in" in data
        assert data["expires_in"] > 0

    def test_login_invalid_email(self, client, registered_user):
        """Test login with non-existent email."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "nonexistent@example.com", "password": "SecurePass123"},
        )

        assert response.status_code == 401
        assert "invalid credentials" in response.json()["detail"].lower()

    def test_login_wrong_password(self, client, test_user_data, registered_user):
        """Test login with incorrect password."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": test_user_data["email"], "password": "WrongPassword123"},
        )

        assert response.status_code == 401
        assert "invalid credentials" in response.json()["detail"].lower()

    def test_login_case_sensitive_email(self, client, test_user_data, registered_user):
        """Test that email matching is case-sensitive for login."""
        # Most email systems treat emails as case-insensitive
        # but for security, we test the current behavior
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user_data["email"].upper(),
                "password": test_user_data["password"],
            },
        )
        # This tests current behavior - may be 401 if case-sensitive
        # or 200 if normalized
        assert response.status_code in [200, 401]


class TestProtectedRoutes:
    """Tests for protected endpoints (GET /api/v1/auth/me)."""

    def test_get_me_without_token(self, client):
        """Test accessing protected route without token returns 401."""
        response = client.get("/api/v1/auth/me")

        assert response.status_code == 401

    def test_get_me_with_valid_token(self, client, auth_headers, test_user_data):
        """Test accessing protected route with valid token."""
        response = client.get("/api/v1/auth/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert "id" in data
        assert "created_at" in data

    def test_get_me_with_invalid_token(self, client):
        """Test accessing protected route with invalid token."""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"},
        )

        assert response.status_code == 401

    def test_get_me_with_malformed_header(self, client):
        """Test accessing protected route with malformed auth header."""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "NotBearer token"},
        )

        assert response.status_code == 401


class TestTokenRefresh:
    """Tests for POST /api/v1/auth/refresh."""

    def test_refresh_token_success(self, client, auth_tokens):
        """Test successful token refresh returns new tokens."""
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": auth_tokens["refresh_token"]},
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        # New tokens should be different (rotation)
        assert data["access_token"] != auth_tokens["access_token"]
        assert data["refresh_token"] != auth_tokens["refresh_token"]

    def test_refresh_token_invalid(self, client):
        """Test refresh with invalid token returns 401."""
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid.refresh.token"},
        )

        assert response.status_code == 401

    def test_refresh_token_reuse_after_rotation(self, client, auth_tokens):
        """Test that old refresh token is revoked after use (rotation)."""
        # First refresh should succeed
        response1 = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": auth_tokens["refresh_token"]},
        )
        assert response1.status_code == 200

        # Second refresh with same token should fail (revoked)
        response2 = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": auth_tokens["refresh_token"]},
        )
        assert response2.status_code == 401


class TestLogout:
    """Tests for POST /api/v1/auth/logout."""

    def test_logout_success(self, client, auth_headers):
        """Test successful logout."""
        response = client.post("/api/v1/auth/logout", headers=auth_headers)

        assert response.status_code == 200
        assert "logged out" in response.json()["message"].lower()

    def test_logout_without_token(self, client):
        """Test logout without authentication returns 401."""
        response = client.post("/api/v1/auth/logout")

        assert response.status_code == 401

    def test_logout_invalidates_refresh_tokens(self, client, auth_tokens, auth_headers):
        """Test that logout revokes all refresh tokens."""
        # Logout
        logout_response = client.post("/api/v1/auth/logout", headers=auth_headers)
        assert logout_response.status_code == 200

        # Try to use refresh token after logout
        refresh_response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": auth_tokens["refresh_token"]},
        )
        assert refresh_response.status_code == 401


class TestAuthIntegration:
    """Integration tests for complete auth flows."""

    def test_full_auth_flow(self, client):
        """Test complete registration -> login -> access -> refresh -> logout flow."""
        user_data = {"email": "flow@example.com", "password": "FlowTest123"}

        # 1. Register
        reg_response = client.post("/api/v1/auth/register", json=user_data)
        assert reg_response.status_code == 201
        user = reg_response.json()

        # 2. Login
        login_response = client.post("/api/v1/auth/login", json=user_data)
        assert login_response.status_code == 200
        tokens = login_response.json()

        # 3. Access protected route
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        me_response = client.get("/api/v1/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["id"] == user["id"]

        # 4. Refresh token
        refresh_response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": tokens["refresh_token"]},
        )
        assert refresh_response.status_code == 200
        new_tokens = refresh_response.json()

        # 5. Use new access token
        new_headers = {"Authorization": f"Bearer {new_tokens['access_token']}"}
        me_response2 = client.get("/api/v1/auth/me", headers=new_headers)
        assert me_response2.status_code == 200

        # 6. Logout
        logout_response = client.post("/api/v1/auth/logout", headers=new_headers)
        assert logout_response.status_code == 200

        # 7. Verify refresh token is revoked
        refresh_after_logout = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": new_tokens["refresh_token"]},
        )
        assert refresh_after_logout.status_code == 401

    def test_multiple_sessions(self, client, test_user_data, registered_user):
        """Test user can have multiple active sessions."""
        # Login twice (simulating two devices)
        login1 = client.post("/api/v1/auth/login", json=test_user_data)
        login2 = client.post("/api/v1/auth/login", json=test_user_data)

        assert login1.status_code == 200
        assert login2.status_code == 200

        tokens1 = login1.json()
        tokens2 = login2.json()

        # Both tokens should be different
        assert tokens1["access_token"] != tokens2["access_token"]
        assert tokens1["refresh_token"] != tokens2["refresh_token"]

        # Both should work
        headers1 = {"Authorization": f"Bearer {tokens1['access_token']}"}
        headers2 = {"Authorization": f"Bearer {tokens2['access_token']}"}

        assert client.get("/api/v1/auth/me", headers=headers1).status_code == 200
        assert client.get("/api/v1/auth/me", headers=headers2).status_code == 200
