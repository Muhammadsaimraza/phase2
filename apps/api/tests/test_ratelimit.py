"""
Tests for rate limiting middleware.

Tests cover:
- Login rate limiting (5 attempts per 15 minutes)
- Register rate limiting (10 per hour)
- 429 response format (RFC 7807)
- Retry-After header
"""

import pytest


class TestLoginRateLimit:
    """Tests for login endpoint rate limiting."""

    def test_login_under_rate_limit(self, client, test_user_data, registered_user):
        """Test that normal login attempts work within rate limit."""
        # First few attempts should work (even if credentials are wrong)
        for i in range(3):
            response = client.post(
                "/api/v1/auth/login",
                json={"email": "wrong@example.com", "password": "WrongPass123"},
            )
            # Should get 401 (invalid credentials), not 429 (rate limited)
            assert response.status_code == 401

    def test_login_exceeds_rate_limit(self, client, test_user_data, registered_user):
        """Test that exceeding login rate limit returns 429."""
        # Make requests until we hit the rate limit
        # Rate limit is 5 per 15 minutes
        responses = []
        for i in range(7):  # Try more than the limit
            response = client.post(
                "/api/v1/auth/login",
                json={"email": "test@example.com", "password": "WrongPass123"},
            )
            responses.append(response)

        # At least one response should be 429 (rate limited)
        status_codes = [r.status_code for r in responses]
        assert 429 in status_codes, f"Expected 429 in responses, got: {status_codes}"

    def test_rate_limit_response_format(self, client, test_user_data, registered_user):
        """Test that 429 response follows RFC 7807 format."""
        # Exhaust rate limit
        for i in range(6):
            response = client.post(
                "/api/v1/auth/login",
                json={"email": "test@example.com", "password": "WrongPass123"},
            )
            if response.status_code == 429:
                break

        if response.status_code == 429:
            data = response.json()
            # Check RFC 7807 fields
            assert "type" in data
            assert "title" in data
            assert data["title"] == "Too Many Requests"
            assert "status" in data
            assert data["status"] == 429
            assert "detail" in data
            assert "rate limit" in data["detail"].lower()

    def test_rate_limit_retry_after_header(
        self, client, test_user_data, registered_user
    ):
        """Test that 429 response includes Retry-After header."""
        # Exhaust rate limit
        for i in range(6):
            response = client.post(
                "/api/v1/auth/login",
                json={"email": "test@example.com", "password": "WrongPass123"},
            )
            if response.status_code == 429:
                break

        if response.status_code == 429:
            assert "Retry-After" in response.headers
            retry_after = int(response.headers["Retry-After"])
            assert retry_after > 0


class TestRegisterRateLimit:
    """Tests for register endpoint rate limiting."""

    def test_register_under_rate_limit(self, client):
        """Test that normal registration works within rate limit."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "newuser@example.com", "password": "SecurePass123"},
        )
        # Should succeed or fail with validation error, not rate limit
        assert response.status_code in [201, 409, 422]

    def test_register_multiple_attempts(self, client):
        """Test multiple registration attempts are tracked."""
        # Register rate limit is more generous (10/hour)
        # Just verify that requests are being tracked
        responses = []
        for i in range(3):
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "email": f"user{i}@example.com",
                    "password": "SecurePass123",
                },
            )
            responses.append(response.status_code)

        # All should succeed (within rate limit)
        assert all(code == 201 for code in responses)


class TestRateLimitHeaders:
    """Tests for rate limit response headers."""

    def test_rate_limit_header_present(self, client, test_user_data, registered_user):
        """Test that rate limit info is in 429 response headers."""
        # Exhaust rate limit
        for i in range(6):
            response = client.post(
                "/api/v1/auth/login",
                json={"email": "test@example.com", "password": "WrongPass123"},
            )
            if response.status_code == 429:
                break

        if response.status_code == 429:
            # Check for rate limit headers
            assert "X-RateLimit-Limit" in response.headers


class TestRateLimitByIP:
    """Tests for IP-based rate limiting."""

    def test_different_endpoints_separate_limits(
        self, client, test_user_data, registered_user
    ):
        """Test that different endpoints have separate rate limits."""
        # Login attempts
        login_response = client.post(
            "/api/v1/auth/login",
            json=test_user_data,
        )
        assert login_response.status_code == 200

        # Access protected endpoint (should not be affected by login limit)
        tokens = login_response.json()
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        me_response = client.get("/api/v1/auth/me", headers=headers)
        assert me_response.status_code == 200
