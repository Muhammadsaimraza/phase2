-- Row Level Security (RLS) Setup for Todo Application
-- Run this after creating tables to enable user isolation

-- ============================================
-- RLS POLICIES FOR USERS TABLE
-- ============================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only read their own record
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (id = current_setting('app.current_user_id')::uuid);

-- Users can only update their own record
CREATE POLICY users_update_own ON users
    FOR UPDATE
    USING (id = current_setting('app.current_user_id')::uuid);

-- ============================================
-- RLS POLICIES FOR TASKS TABLE
-- ============================================

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tasks
CREATE POLICY tasks_select_own ON tasks
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Users can only insert tasks for themselves
CREATE POLICY tasks_insert_own ON tasks
    FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

-- Users can only update their own tasks
CREATE POLICY tasks_update_own ON tasks
    FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Users can only delete their own tasks
CREATE POLICY tasks_delete_own ON tasks
    FOR DELETE
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- ============================================
-- RLS POLICIES FOR SESSIONS TABLE
-- ============================================

-- Enable RLS on sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY sessions_select_own ON sessions
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Users can only delete their own sessions (logout)
CREATE POLICY sessions_delete_own ON sessions
    FOR DELETE
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- ============================================
-- HELPER FUNCTION FOR SETTING CURRENT USER
-- ============================================

-- Function to set current user context (call from application)
CREATE OR REPLACE FUNCTION set_current_user_id(user_id uuid)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- BYPASS RLS FOR SERVICE ROLE
-- ============================================

-- Create a service role that bypasses RLS (for admin operations)
-- Note: Only use this for system-level operations, not user requests

-- Grant bypass to specific roles if needed:
-- ALTER ROLE service_role BYPASSRLS;

-- ============================================
-- NOTES
-- ============================================

-- 1. RLS is enforced at the database level, providing defense-in-depth
-- 2. The application must call set_current_user_id() before queries
-- 3. If current_user_id is not set, no rows will be returned (secure default)
-- 4. Neon supports RLS out of the box
-- 5. Test policies with: SET app.current_user_id = 'uuid-here';
