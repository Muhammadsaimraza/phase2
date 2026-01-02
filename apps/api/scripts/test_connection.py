#!/usr/bin/env python3
"""
Test Neon PostgreSQL database connection.

Usage:
    cd apps/api
    python scripts/test_connection.py
"""

import asyncio
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.core.database import engine, get_database_url


async def test_connection():
    """Test the database connection and print diagnostics."""
    print("=" * 50)
    print("Neon PostgreSQL Connection Test")
    print("=" * 50)

    # Show connection info (masked)
    db_url = get_database_url()
    masked_url = db_url.split("@")[1] if "@" in db_url else db_url
    print(f"\nConnecting to: ...@{masked_url}")

    try:
        async with engine.connect() as conn:
            # Test basic connectivity
            result = await conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            print(f"\n[PASS] Basic connectivity: SELECT 1 = {row[0]}")

            # Get PostgreSQL version
            result = await conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"[INFO] PostgreSQL version: {version.split(',')[0]}")

            # Get current database
            result = await conn.execute(text("SELECT current_database()"))
            db_name = result.fetchone()[0]
            print(f"[INFO] Database: {db_name}")

            # Get current user
            result = await conn.execute(text("SELECT current_user"))
            user = result.fetchone()[0]
            print(f"[INFO] User: {user}")

            # Check if we can create tables (permission test)
            try:
                await conn.execute(
                    text(
                        """
                    CREATE TABLE IF NOT EXISTS _connection_test (
                        id SERIAL PRIMARY KEY,
                        tested_at TIMESTAMP DEFAULT NOW()
                    )
                """
                    )
                )
                await conn.execute(text("DROP TABLE IF EXISTS _connection_test"))
                print("[PASS] Table creation permissions: OK")
            except Exception as e:
                print(f"[WARN] Table creation test failed: {e}")

            # Check SSL
            result = await conn.execute(text("SHOW ssl"))
            ssl_status = result.fetchone()[0]
            print(f"[INFO] SSL: {ssl_status}")

            # Check timezone
            result = await conn.execute(text("SHOW timezone"))
            tz = result.fetchone()[0]
            print(f"[INFO] Timezone: {tz}")

            print("\n" + "=" * 50)
            print("[SUCCESS] All connection tests passed!")
            print("=" * 50)
            return True

    except Exception as e:
        print(f"\n[FAIL] Connection failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check DATABASE_URL in .env file")
        print("2. Ensure Neon project is active (not suspended)")
        print("3. Verify IP is allowed in Neon dashboard")
        print("4. Check network connectivity")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
