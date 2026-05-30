import { createClient } from '@supabase/supabase-js';

// process.env 대신 import.meta.env를 사용합니다 (Vite 표준)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("환경 변수가 누락되었습니다! .env 파일을 확인하세요.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);