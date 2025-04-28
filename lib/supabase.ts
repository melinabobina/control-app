import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xtdwqdobrbsieqkhughj.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZHdxZG9icmJzaWVxa2h1Z2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNTgzMDIsImV4cCI6MjA1NDczNDMwMn0.WIz8uR7Hq1Rwr4LNJtyP64_QoXYPSM7fxfzDbWXQGMY";

// Throw clear error if URL or key is missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and API key must be provided in environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
console.log('Initialized Supabase client with auto refresh:', supabase.auth.autoRefreshToken);

// Log auth events
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  console.log('Session present:', session ? 'Yes' : 'No');
  if (session) {
    console.log('User email:', session.user?.email);
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : 'unknown';
    console.log('Session expires:', expiresAt);
  }
});

// Test the session persistence
setTimeout(async () => {
  console.log('Testing session persistence after initialization...');
  const { data, error } = await supabase.auth.getSession();
  console.log('Session exists after init:', data?.session ? 'Yes' : 'No');
  console.log('Session error:', error ? error.message : 'None');
}, 5000);
// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG

// Helper function to ensure a valid session
export const ensureAuthSession = async () => {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    // If no session or session appears expired, try refreshing
    if (!session) {
      console.log("No session found, attempting to refresh...");
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) throw refreshError;

      if (!refreshData.session) {
        throw new Error("Failed to obtain a valid session");
      }

      return refreshData.session;
    }

    return session;
  } catch (error) {
    console.error("Session error:", error);
    throw error;
  }
};

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});