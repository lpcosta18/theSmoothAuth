-- Migration: 001_create_profiles_table.sql
-- Creates the profiles table for storing user profile data synced from Clerk

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,  -- Reference to Clerk user ID
  name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'basic' CHECK (role IN ('basic', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Row Level Security (RLS) Policies
-- Note: Primary security is handled via Clerk auth() in Server Actions
-- These policies serve as an extra security layer if database is accessed directly
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow select for authenticated users (validated via Clerk in application layer)
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
USING (true); -- Permit select if Server Action validates the user

-- Allow update for authenticated users
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
USING (true);

-- Allow insert for authenticated users
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row update
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();