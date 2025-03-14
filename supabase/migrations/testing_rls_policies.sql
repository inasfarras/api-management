-- WARNING: This script is for TESTING ONLY
-- It creates permissive RLS policies that allow all operations without authentication
-- DO NOT use this in production!

-- Drop existing policies
DROP POLICY IF EXISTS select_own_api_keys ON api_keys;
DROP POLICY IF EXISTS insert_own_api_keys ON api_keys;
DROP POLICY IF EXISTS update_own_api_keys ON api_keys;
DROP POLICY IF EXISTS delete_own_api_keys ON api_keys;

-- Create permissive policies for testing
CREATE POLICY select_all_api_keys ON api_keys
  FOR SELECT
  USING (true);

CREATE POLICY insert_all_api_keys ON api_keys
  FOR INSERTs
  WITH CHECK (true);

CREATE POLICY update_all_api_keys ON api_keys
  FOR UPDATE
  USING (true);

CREATE POLICY delete_all_api_keys ON api_keys
  FOR DELETE
  USING (true);

-- IMPORTANT: For testing purposes, temporarily disable the foreign key constraint
-- This allows us to insert records with a dummy user_id
-- First, create a backup of the existing constraint
DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'api_keys'::regclass::oid
    AND conname = 'api_keys_user_id_fkey';
  
  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE api_keys DROP CONSTRAINT ' || constraint_name;
    EXECUTE 'ALTER TABLE api_keys ADD CONSTRAINT ' || constraint_name || 
            ' FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID';
  END IF;
END
$$;

-- To revert back to secure policies and re-enable the constraint, run the following:
/*
-- Revert the policies
DROP POLICY IF EXISTS select_all_api_keys ON api_keys;
DROP POLICY IF EXISTS insert_all_api_keys ON api_keys;
DROP POLICY IF EXISTS update_all_api_keys ON api_keys;
DROP POLICY IF EXISTS delete_all_api_keys ON api_keys;

-- Create secure policies
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

-- Re-enable the foreign key constraint
DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'api_keys'::regclass::oid
    AND conname = 'api_keys_user_id_fkey';
  
  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE api_keys DROP CONSTRAINT ' || constraint_name;
    EXECUTE 'ALTER TABLE api_keys ADD CONSTRAINT ' || constraint_name || 
            ' FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE';
  END IF;
END
$$;
*/ 