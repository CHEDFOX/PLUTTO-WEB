'use client';

/**
 * SUPABASE (web) — the SAME auth project the mobile app uses
 * (src/api/supabase.js), so an account created on the phone signs in here and
 * vice-versa. The anon key is a public client key by design; row-level security
 * on the server is what actually protects data.
 *
 * Mobile stores the session in SecureStore; on web the default localStorage
 * adapter is correct. detectSessionInUrl is ON here because OAuth returns to a
 * browser URL.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auth.plutto.space';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbmZ1dGVpZnpkbWVic2VqbG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjQ4NTQsImV4cCI6MjA4NjUwMDg1NH0.mZWdCCLuPBeUx79kVfGK9kAOtkuNg-3w3zB6tYBEXB4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/** Bearer token for API calls, or null when signed out. */
export async function accessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  } catch {
    return null;
  }
}

export const auth = {
  sendEmailCode: (email) =>
    supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }),

  verifyEmailCode: (email, token) =>
    supabase.auth.verifyOtp({ email, token, type: 'email' }),

  signInWithGoogle: (redirectTo) =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } }),

  signInWithApple: (redirectTo) =>
    supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } }),

  signOut: () => supabase.auth.signOut(),

  getUser: async () => {
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user || null;
    } catch {
      return null;
    }
  },
};
