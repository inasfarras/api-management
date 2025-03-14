import { supabase, ApiKey } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { TESTING_MODE, TESTING_CONFIG } from './config';

/**
 * Error class for API key-related operations
 */
export class ApiKeyError extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

/**
 * Fetch all API keys for the current user
 * @returns Promise resolving to an array of API keys
 * @throws ApiKeyError if the fetch operation fails
 */
export const fetchApiKeys = async (): Promise<ApiKey[]> => {
  try {
    // Get current session
    const { data: session } = await supabase.auth.getSession();
    let query = supabase.from('api_keys').select('*');
    
    // In production mode, filter by user_id
    if (!TESTING_MODE || !TESTING_CONFIG.bypassAuth) {
      const user_id = session?.session?.user?.id;
      if (!user_id) {
        if (TESTING_CONFIG.verboseLogging) {
          console.log('No user ID found, returning empty array');
        }
        return [];
      }
      query = query.eq('user_id', user_id);
    }
    
    // Execute the query with newest keys first
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new ApiKeyError(`Failed to fetch API keys: ${error.message}`, error);
    }

    return data || [];
  } catch (error) {
    if (error instanceof ApiKeyError) {
      throw error;
    }
    console.error('Error in fetchApiKeys:', error);
    throw new ApiKeyError('Failed to fetch API keys', error);
  }
};

/**
 * Create a new API key
 * @param name Name of the API key
 * @param type Type of the API key (default: 'Development')
 * @param usage_limit Usage limit of the API key (default: 1000)
 * @param piiEnabled Whether PII processing is enabled (default: false)
 * @returns Promise resolving to the newly created API key
 * @throws ApiKeyError if the create operation fails
 */
export const createApiKey = async (
  name: string, 
  type: string = 'Development',
  usage_limit: number = 1000,
  piiEnabled: boolean = false
): Promise<ApiKey> => {
  try {
    // Get current session
    const { data: session } = await supabase.auth.getSession();
    let user_id = session?.session?.user?.id;
    
    // For testing purposes, use a dummy ID if no user is logged in
    if (!user_id) {
      if (TESTING_MODE && TESTING_CONFIG.useDummyUserId) {
        if (TESTING_CONFIG.verboseLogging) {
          console.log('No user ID found, using test ID');
        }
        user_id = TESTING_CONFIG.dummyUserId;
      } else {
        throw new ApiKeyError('User not authenticated. Please sign in to create an API key.');
      }
    }
    
    // Generate a unique API key with a prefix based on the type
    const prefix = type.toLowerCase() === 'production' ? 'tvly-prod-' : 'tvly-dev-';
    const key = `${prefix}${uuidv4()}`;
    
    // Insert the new API key
    const { data, error } = await supabase.from('api_keys').insert([
      {
        id: uuidv4(),
        name,
        key,
        user_id,
        type,
        usage_limit,
        usage: 0,
        pii_enabled: piiEnabled,
        created_at: new Date().toISOString()
      }
    ]).select('*').single();
    
    if (error) {
      throw new ApiKeyError(`Failed to create API key: ${error.message}`, error);
    }
    
    return data as ApiKey;
  } catch (error) {
    if (error instanceof ApiKeyError) {
      throw error;
    }
    console.error('Error in createApiKey:', error);
    throw new ApiKeyError('Failed to create API key', error);
  }
};

/**
 * Update an existing API key
 * @param id ID of the API key to update
 * @param updates Object containing the properties to update
 * @returns Promise resolving to the updated API key
 * @throws ApiKeyError if the update operation fails
 */
export const updateApiKey = async (
  id: string, 
  updates: Partial<Omit<ApiKey, 'id' | 'key' | 'created_at' | 'user_id'>>
): Promise<ApiKey> => {
  try {
    // Get the user ID for security check
    const { data: session } = await supabase.auth.getSession();
    const user_id = session?.session?.user?.id;
    
    // Update the API key
    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .match({ id: id })
      // Apply user_id filter for security (except in testing mode)
      .match(!TESTING_MODE || !TESTING_CONFIG.bypassAuth ? { user_id } : {})
      .select()
      .single();
    
    if (error) {
      throw new ApiKeyError(`Failed to update API key: ${error.message}`, error);
    }
    
    return data as ApiKey;
  } catch (error) {
    if (error instanceof ApiKeyError) {
      throw error;
    }
    console.error('Error in updateApiKey:', error);
    throw new ApiKeyError('Failed to update API key', error);
  }
};

/**
 * Delete an API key
 * @param id ID of the API key to delete
 * @returns Promise resolving to void
 * @throws ApiKeyError if the delete operation fails
 */
export const deleteApiKey = async (id: string): Promise<void> => {
  try {
    // Get the user ID for security check
    const { data: session } = await supabase.auth.getSession();
    const user_id = session?.session?.user?.id;
    
    // Delete the API key
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .match({ id: id })
      // Apply user_id filter for security (except in testing mode)
      .match(!TESTING_MODE || !TESTING_CONFIG.bypassAuth ? { user_id } : {})
      .select();
    
    if (error) {
      throw new ApiKeyError(`Failed to delete API key: ${error.message}`, error);
    }
  } catch (error) {
    if (error instanceof ApiKeyError) {
      throw error;
    }
    console.error('Error in deleteApiKey:', error);
    throw new ApiKeyError('Failed to delete API key', error);
  }
}; 