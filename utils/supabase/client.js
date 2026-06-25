import { createBrowserClient } from '@supabase/ssr';

// 💡 전역 변수로 인스턴스를 하나만 관리합니다.
let supabaseClient = null;

export const createClient = () => {
  // 이미 만들어진 리모컨이 있으면 그걸 쓰고, 없으면 새로 만듭니다.
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  return supabaseClient;
};

// 💡 밖으로 내보낼 때는 위 함수를 사용하세요.
export const supabase = createClient();