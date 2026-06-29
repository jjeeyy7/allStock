// app/actions.js (새로 만드세요)
'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut(); // 인증 파기
  
  // 서버가 브라우저에 쿠키 삭제 명령을 내림
  // (ssr 클라이언트가 알아서 쿠키를 지워줍니다)
  redirect('/main');
}