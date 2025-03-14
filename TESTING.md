# Testing Guide for API Management Dashboard

This guide provides instructions for testing the API Management Dashboard with Supabase.

## Testing Setup

### 1. Configure Testing Mode

The application includes a testing mode that makes it easier to test without authentication. To enable testing mode:

1. Open `src/lib/config.ts`
2. Ensure `TESTING_MODE` is set to `true`
3. Configure the testing options as needed:
   - `bypassAuth`: If true, authentication will be bypassed for API operations
   - `useDummyUserId`: If true, a dummy user ID will be used when no user is logged in
   - `dummyUserId`: The dummy user ID to use when no user is logged in
   - `verboseLogging`: If true, console logs will include additional debugging information

### 2. Set Up Database for Testing

You have two options for setting up the database for testing:

#### Option A: Use Permissive RLS Policies (Keeps Foreign Key Constraint)

This approach keeps the table structure but makes the RLS policies permissive:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/testing_rls_policies.sql`
4. Run the query to create permissive policies

**Note**: This temporarily relaxes the foreign key constraint but doesn't remove it completely.

#### Option B: Use Simplified Table Structure (Recommended for Testing)

This approach creates a simplified table structure without the foreign key constraint:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/simplified_testing_setup.sql`
4. Run the query to create a simplified table structure

**WARNING**: This will drop the existing table and create a new one without the foreign key constraint. Only use this for testing purposes.

### 3. Configure Environment Variables

Make sure your `.env.local` file contains the correct Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Workflow

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test CRUD Operations

#### Create API Key
- Click "Add Key" button
- Enter a name for the key
- Set the usage limit
- Click "Create API Key"

#### Read API Keys
- The API keys should be displayed in the table
- Test the "Show/Hide" functionality
- Test the "Copy" functionality

#### Update API Key
- Click the edit icon for an API key
- Change the name or other properties
- Click "Save"

#### Delete API Key
- Click the delete icon for an API key
- Confirm the deletion

### 3. Check Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the Table Editor
3. Select the `api_keys` table
4. Verify that the data matches what you see in the application

## Troubleshooting

### Hydration Errors

If you encounter React hydration errors:

1. Make sure both the `<html>` and `<body>` tags have the `suppressHydrationWarning` attribute in `src/app/layout.tsx`
2. Check for browser extensions that might be modifying the HTML
3. Restart the development server

### Foreign Key Constraint Errors

If you encounter foreign key constraint errors:

1. Use the simplified table structure (Option B) for testing
2. Make sure there's a matching entry in the auth.users table for the user_id being used
3. Check that the user_id is being properly set in the API key service

### Authentication Issues

If you encounter authentication issues:

1. Check that `TESTING_MODE` is set to `true` in `src/lib/config.ts`
2. Verify that the RLS policies have been updated using one of the testing SQL scripts
3. Check the browser console for error messages

### Database Connection Issues

If you encounter database connection issues:

1. Verify that your Supabase URL and API key are correct in `.env.local`
2. Check that your Supabase project is running
3. Check the browser console for error messages

## Switching to Production Mode

When you're ready to switch to production mode:

1. Set `TESTING_MODE` to `false` in `src/lib/config.ts`
2. Run the commented-out section in the SQL script to revert the database changes
3. Implement proper authentication using Supabase Auth 