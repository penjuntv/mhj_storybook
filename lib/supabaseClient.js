// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 간단한 방어 코드 (환경변수 설정 안 했을 때 콘솔에서 알려주기)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해 주세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
