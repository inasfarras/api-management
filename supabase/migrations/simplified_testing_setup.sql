-- WARNING: This script is for TESTING ONLY
-- It creates a simplified version of the api_keys table without the foreign key constraint
-- DO NOT use this in production!

-- Create a backup of the existing table if needed
-- CREATE TABLE IF NOT EXISTS api_keys_backup AS SELECT * FROM api_keys;

-- Drop existing table (WARNING: This will delete all data!)
DROP TABLE IF EXISTS api_keys;

-- Create a simplified version of the table without the foreign key constraint
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'Development',
  usage_limit INTEGER NOT NULL DEFAULT 1000,
  pii_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  usage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID -- No foreign key constraint for testing
);

-- Create permissive policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_all_api_keys ON api_keys
  FOR SELECT
  USING (true);

CREATE POLICY insert_all_api_keys ON api_keys
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY update_all_api_keys ON api_keys
  FOR UPDATE
  USING (true);

CREATE POLICY delete_all_api_keys ON api_keys
  FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_idx ON api_keys (key);

-- To restore the original table structure, run the following:
/*
-- Drop the testing table
DROP TABLE IF EXISTS api_keys;

-- Create the proper table with foreign key constraint
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'Development',
  usage_limit INTEGER NOT NULL DEFAULT 1000,
  pii_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  usage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Restore data if needed
-- INSERT INTO api_keys SELECT * FROM api_keys_backup;

-- Create secure policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_api_keys ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_api_keys ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_api_keys ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY delete_own_api_keys ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_idx ON api_keys (key);
*/ 