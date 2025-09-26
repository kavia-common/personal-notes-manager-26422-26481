//
// PUBLIC_INTERFACE
// Supabase client initialization using environment variables.
// Requires REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in the environment.
//
import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client configured from environment variables.
 * Note: Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set in .env.
 */
export function getSupabaseClient() {
  /** This is a public function. */
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // Provide a helpful runtime error with guidance.
    console.error(
      'Supabase configuration missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in the environment.'
    );
  }

  // Use a lazy module-scoped singleton pattern to avoid multiple clients.
  if (!window.__supabase_client__) {
    window.__supabase_client__ = createClient(url, key);
  }
  return window.__supabase_client__;
}
