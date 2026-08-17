import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const rawUrl =
  metaEnv.VITE_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://ynntsloaxuehizgbqenr.supabase.co';

const rawKey =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_AiiQWTfqM8HYOv6m7YSgIg_pBff-SWL';

// Clean URL if /rest/v1/ was appended
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

export const supabase = createClient(cleanUrl, rawKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const getSupabaseConfig = () => ({
  url: cleanUrl,
  hasKey: !!rawKey,
});
