
// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
// utils/debugAuth.js
// utils/debugAuth.js
import { supabase } from '../lib/supabase';

export const debugAuth = {
  async checkSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('==== AUTH DEBUG ====');
      console.log('Session check result:', data?.session ? 'Session exists' : 'No session');
      console.log('Session user:', data?.session?.user?.email || 'No user');
      console.log('Session expires at:', data?.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toLocaleString()
        : 'No expiration');
      console.log('Error:', error ? error.message : 'No error');
      console.log('====================');
      return { data, error };
    } catch (e) {
      console.log('==== AUTH DEBUG ====');
      console.log('Error checking session:', e);
      console.log('====================');
      return { data: null, error: e };
    }
  },

  logAuthOperation(operation, result) {
    console.log(`==== AUTH ${operation.toUpperCase()} ====`);
    console.log('Success:', result.error ? 'No' : 'Yes');
    console.log('Error:', result.error ? result.error.message : 'None');
    console.log('====================');
  }
};
//DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG