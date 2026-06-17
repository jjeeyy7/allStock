import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // 브라우저(클라이언트)에서 안전하게 Supabase에 접근하는 리모컨을 생성합니다.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}