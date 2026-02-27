import { createClient } from '@supabase/supabase-js';

// Use environment variables, with empty string fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If variables are missing, provide a warning but don't crash the entire build
if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️ Supabase credentials are missing! The app will not be able to connect to the database.');
    }
}

// Ensure the build doesn't crash by providing a dummy URL if one isn't present
// This allows the build to finish, but requests will fail at runtime until keys are added to the host
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
