import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("Supabase initialization check...");
if (!supabaseUrl) console.error("CRITICAL: VITE_SUPABASE_URL is missing!");
if (!supabaseAnonKey) console.error("CRITICAL: VITE_SUPABASE_ANON_KEY is missing!");

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (supabase) {
    console.log("Supabase client successfully initialized.");
} else {
    console.error("Supabase client failed to initialize due to missing env vars.");
}
