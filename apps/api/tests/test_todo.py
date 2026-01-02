"""Tests for Todo CRUD endpoints."""

from uuid import uuid4

import pytest


class TestCreateTodo:
    """Tests for POST /api/v1/todos."""

    def test_create_todo_success(self, client, auth_headers):
        """Test creating a new todo."""
        response = client.post(
            "/api/v1/todos",
            json={
                "title": "New Todo",
                "description": "A new todo item",
                "priority": "high",
            },
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Todo"
        assert data["description"] == "A new todo item"
        assert data["priority"] == "high"
        assert data["status"] == "pending"
        assert "id" in data
        assert "user_id" in data

    def test_create_todo_minimal(self, client, auth_headers):
        """Test creating a todo with only required fields."""
        response = client.post(
            "/api/v1/todos",
            json={"title": "Minimal Todo"},
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Minimal Todo"
        assert data["description"] is None
        assert data["priority"] == "medium"  # default

    def test_create_todo_unauthorized(self, client):
        """Test creating a todo without authentication."""
        response = client.post(
            "/api/v1/todos",
            json={"title": "Unauthorized Todo"},
        )

        assert response.status_code == 401

    def test_create_todo_empty_title(self, client, auth_headers):
        """Test creating a todo with empty title fails."""
        response = client.post(
            "/api/v1/todos",
            json={"title": ""},
            headers=auth_headers,
        )

        assert response.status_code == 422  # Validation error

    def test_create_todo_title_too_long(self, client, auth_headers):
        """Test creating a todo with title > 200 chars fails."""
        response = client.post(
            "/api/v1/todos",
            json={"title": "x" * 201},
            headers=auth_headers,
        )

        assert response.status_code == 422  # Validation error


class TestListTodos:
    """Tests for GET /api/v1/todos."""

    def test_list_todos_success(self, client, auth_headers):
        """Test listing todos."""
        # Create a todo first
        client.post(
            "/api/v1/todos",
            json={"title": "List Test Todo"},
            headers=auth_headers,
        )

        response = client.get(
            "/api/v1/todos",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "per_page" in data
        assert "pages" in data
        assert len(data["items"]) >= 1

    def test_list_todos_with_status_filter(self, client, auth_headers):
        """Test listing todos with status filter."""
        # Create a todo
        client.post(
            "/api/v1/todos",
            json={"title": "Status Filter Test"},
            headers=auth_headers,
        )

        response = client.get(
            "/api/v1/todos?status=pending",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["status"] == "pending"

    def test_list_todos_with_priority_filter(self, client, auth_headers):
        """Test listing todos with priority filter."""
        # Create a high priority todo
        client.post(
            "/api/v1/todos",
            json={"title": "High Priority Test", "priority": "high"},
            headers=auth_headers,
        )

        response = client.get(
            "/api/v1/todos?priority=high",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["priority"] == "high"

    def test_list_todos_unauthorized(self, client):
        """Test listing todos without authentication."""
        response = client.get("/api/v1/todos")

        assert response.status_code == 401

    def test_list_todos_pagination(self, client, auth_headers):
        """Test listing todos with pagination."""
        # Create multiple todos
        for i in range(15):
            client.post(
                "/api/v1/todos",
                json={"title": f"Pagination Todo {i}"},
                headers=auth_headers,
            )

        # Get first page with 10 items
        response = client.get(
            "/api/v1/todos?page=1&per_page=10",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 10
        assert data["page"] == 1
        assert data["pages"] >= 2


class TestGetTodo:
    """Tests for GET /api/v1/todos/{id}."""

    def test_get_todo_success(self, client, auth_headers):
        """Test getting a single todo."""
        # Create a todo first
        create_response = client.post(
            "/api/v1/todos",
            json={"title": "Get Test Todo"},
            headers=auth_headers,
        )
        todo_id = create_response.json()["id"]

        response = client.get(
            f"/api/v1/todos/{todo_id}",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == todo_id
        assert data["title"] == "Get Test Todo"

    def test_get_todo_not_found(self, client, auth_headers):
        """Test getting a non-existent todo."""
        response = client.get(
            f"/api/v1/todos/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    def test_get_todo_unauthorized(self, client):
        """Test getting a todo without authentication."""
        response = client.get(f"/api/v1/todos/{uuid4()}")

        assert response.status_code == 401


class TestUpdateTodo:
    """Tests for PATCH /api/v1/todos/{id}."""

    def test_update_todo_title(self, client, auth_headers):
        """Test updating a todo's title."""
        # Create a todo first
        create_response = client.post(
            "/api/v1/todos",
            json={"title": "Update Test Todo"},
            headers=auth_headers,
        )
        todo_id = create_response.json()["id"]

        response = client.patch(
            f"/api/v1/todos/{todo_id}",
            json={"title": "Updated Title"},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

    def test_update_todo_status_to_completed(self, client, auth_headers):
        """Test marking a todo as completed."""
        # Create a todo first
        create_response = client.post(
            "/api/v1/todos",
            json={"title": "Complete Test Todo"},
            headers=auth_headers,
        )
        todo_id = create_response.json()["id"]

        response = client.patch(
            f"/api/v1/todos/{todo_id}",
            json={"status": "completed"},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["completed_at"] is not None

    def test_update_todo_not_found(self, client, auth_headers):
        """Test updating a non-existent todo."""
        response = client.patch(
            f"/api/v1/todos/{uuid4()}",
            json={"title": "Updated"},
            headers=auth_headers,
        )

        assert response.status_code == 404

    def test_update_todo_unauthorized(self, client):
        """Test updating a todo without authentication."""
        response = client.patch(
            f"/api/v1/todos/{uuid4()}",
            json={"title": "Updated"},
        )

        assert response.status_code == 401


class TestDeleteTodo:
    """Tests for DELETE /api/v1/todos/{id}."""

    def test_delete_todo_success(self, client, auth_headers):
        """Test deleting a todo."""
        # Create a todo first
        create_response = client.post(
            "/api/v1/todos",
            json={"title": "Delete Test Todo"},
            headers=auth_headers,
        )
        todo_id = create_response.json()["id"]

        response = client.delete(
            f"/api/v1/todos/{todo_id}",
            headers=auth_headers,
        )

        assert response.status_code == 204

        # Verify it's deleted
        get_response = client.get(
            f"/api/v1/todos/{todo_id}",
            headers=auth_headers,
        )
        assert get_response.status_code == 404

    def test_delete_todo_not_found(self, client, auth_headers):
        """Test deleting a non-existent todo."""
        response = client.delete(
            f"/api/v1/todos/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    def test_delete_todo_unauthorized(self, client):
        """Test deleting a todo without authentication."""
        response = client.delete(f"/api/v1/todos/{uuid4()}")

        assert response.status_code == 401


class TestCompleteTodo:
    """Tests for POST /api/v1/todos/{id}/complete."""

    def test_complete_todo_success(self, client, auth_headers):
        """Test completing a todo."""
        # Create a todo first
        create_response = client.post(
            "/api/v1/todos",
            json={"title": "Complete API Test Todo"},
            headers=auth_headers,
        )
        todo_id = create_response.json()["id"]

        response = client.post(
            f"/api/v1/todos/{todo_id}/complete",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["completed_at"] is not None

    def test_complete_todo_not_found(self, client, auth_headers):
        """Test completing a non-existent todo."""
        response = client.post(
            f"/api/v1/todos/{uuid4()}/complete",
            headers=auth_headers,
        )

        assert response.status_code == 404

    def test_complete_todo_unauthorized(self, client):
        """Test completing a todo without authentication."""
        response = client.post(f"/api/v1/todos/{uuid4()}/complete")

        assert response.status_code == 401


class TestUserIsolation:
    """Tests for user isolation - users can only access their own todos."""

    def test_user_cannot_see_other_users_todos(self, client, auth_headers):
        """Test that users cannot see other users' todos."""
        # Create a todo as first user
        create_response = client.post(
            "/api/v1/todos",
            json={"title": "First User's Todo"},
            headers=auth_headers,
        )
        todo_id = create_response.json()["id"]

        # Create another user
        client.post(
            "/api/v1/auth/register",
            json={"email": "other@example.com", "password": "OtherPass123"},
        )

        # Login as other user
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": "other@example.com", "password": "OtherPass123"},
        )
        other_headers = {
            "Authorization": f"Bearer {login_response.json()['access_token']}"
        }

        # Try to access first user's todo
        response = client.get(
            f"/api/v1/todos/{todo_id}",
            headers=other_headers,
        )

        # Should return 404 (not 403, to prevent enumeration)
        assert response.status_code == 404

    def test_user_list_only_shows_own_todos(self, client, auth_headers):
        """Test that list only returns user's own todos."""
        # Create a todo as first user
        client.post(
            "/api/v1/todos",
            json={"title": "First User's Todo"},
            headers=auth_headers,
        )

        # Create another user with a todo
        client.post(
            "/api/v1/auth/register",
            json={"email": "isolation@example.com", "password": "IsolationPass123"},
        )
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": "isolation@example.com", "password": "IsolationPass123"},
        )
        other_headers = {
            "Authorization": f"Bearer {login_response.json()['access_token']}"
        }

        # Create todo as other user
        other_create = client.post(
            "/api/v1/todos",
            json={"title": "Other User's Todo"},
            headers=other_headers,
        )
        other_user_id = other_create.json()["user_id"]

        # List todos as other user - should only see their own
        response = client.get(
            "/api/v1/todos",
            headers=other_headers,
        )

        assert response.status_code == 200
        data = response.json()

        # All returned todos should belong to other user
        for item in data["items"]:
            assert item["user_id"] == other_user_id
