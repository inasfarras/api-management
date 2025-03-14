-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'Development',
  limit INTEGER NOT NULL DEFAULT 1000,
  pii_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  usage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an RLS policy to allow users to only see their own API keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy for selecting API keys
CREATE POLICY select_own_api_keys ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for inserting API keys
CREATE POLICY insert_own_api_keys ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating API keys
CREATE POLICY update_own_api_keys ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for deleting API keys
CREATE POLICY delete_own_api_keys ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create an index on the user_id column for faster queries
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys (user_id);

-- Create an index on the key column for faster lookups
CREATE INDEX IF NOT EXISTS api_keys_key_idx ON api_keys (key); 