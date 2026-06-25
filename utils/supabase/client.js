import { createBrowserClient } from '@supabase/ssr';

// 💡 전역 변수로 인스턴스를 하나만 관리합니다.
let supabaseClient = null;

export function createClient() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true, // 💡 이것이 있어야 localStorage에 토큰이 쌓입니다.
        storageKey: 'supabase-auth-token', // 명시적으로 이름을 지정
      }
    }
  );
  return supabaseClient;
}

// 💡 밖으로 내보낼 때는 위 함수를 사용하세요.
export const supabase = createClient();