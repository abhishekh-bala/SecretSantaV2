import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Guide {
  id: string;
  name: string;
  password: string;
  has_viewed: boolean;
  created_at: string;
}

export interface Assignment {
  id: string;
  guide_id: string;
  assigned_to_id: string;
  created_at: string;
}
