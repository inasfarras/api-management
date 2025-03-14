// Configuration settings for the application

// Set this to true for testing mode, false for production mode
export const TESTING_MODE = true;

// Testing-specific configuration
export const TESTING_CONFIG = {
  // If true, authentication will be bypassed for API operations
  bypassAuth: true,
  
  // If true, a dummy user ID will be used when no user is logged in
  useDummyUserId: true,
  
  // The dummy user ID to use when no user is logged in
  dummyUserId: '00000000-0000-0000-0000-000000000000',
  
  // If true, console logs will include additional debugging information
  verboseLogging: true
}; 