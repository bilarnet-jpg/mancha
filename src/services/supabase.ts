import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://hkkuhqkkvcxjzedadawb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhra3VocWtrdmN4anplZGFkYXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3OTQ2NjQsImV4cCI6MjA5NjM3MDY2NH0.h8vB3taamveXSbzmuBJuFDfmaAANkRHTkvMPA9aIeqo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
