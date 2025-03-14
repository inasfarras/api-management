import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definition for API keys
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  usage: number;
  type: string;
  usage_limit: number;
  pii_enabled: boolean;
  user_id?: string;
} 