# Supabase Setup Instructions

This document provides instructions on how to set up the Supabase database for the API Management application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new or existing Supabase project

## Setup Steps

### 1. Create a new Supabase project (if you don't have one already)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Enter your project details and create the project

### 2. Set up the database schema

1. In your Supabase project dashboard, navigate to the SQL Editor
2. Create a new query
3. Copy and paste the contents of the `migrations/api_keys_table.sql` file
4. Run the query to create the necessary tables and policies

### 3. Configure environment variables

1. In your Supabase project dashboard, go to Settings > API
2. Copy the "Project URL" and "anon public" key
3. Update your `.env.local` file with these values:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. (Optional) Set up authentication

If you want to implement user authentication:

1. In your Supabase project dashboard, go to Authentication > Providers
2. Enable the authentication providers you want to use (Email, Google, GitHub, etc.)
3. Configure the providers according to your requirements

## Database Schema

The application uses the following table:

### api_keys

| Column       | Type      | Description                               |
|--------------|-----------|-------------------------------------------|
| id           | UUID      | Primary key                               |
| name         | TEXT      | Name of the API key                       |
| key          | TEXT      | The actual API key (unique)               |
| type         | TEXT      | Type of the API key (Development, Production, etc.) |
| limit        | INTEGER   | Usage limit for the API key               |
| pii_enabled  | BOOLEAN   | Whether PII processing is enabled         |
| usage        | INTEGER   | Current usage count                       |
| created_at   | TIMESTAMP | When the API key was created              |
| user_id      | UUID      | Foreign key to auth.users                 |

## Row Level Security (RLS)

The database is configured with Row Level Security to ensure that users can only access their own API keys. The following policies are in place:

- `select_own_api_keys`: Users can only select their own API keys
- `insert_own_api_keys`: Users can only insert API keys with their own user_id
- `update_own_api_keys`: Users can only update their own API keys
- `delete_own_api_keys`: Users can only delete their own API keys 