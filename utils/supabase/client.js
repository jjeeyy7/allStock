import { createBrowserClient } from '@supabase/ssr';

// 💡 전역 변수로 인스턴스를 하나만 관리합니다.
let supabaseClient = null;

export function createClient() {

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// 💡 밖으로 내보낼 때는 위 함수를 사용하세요.
export const supabase = createClient();