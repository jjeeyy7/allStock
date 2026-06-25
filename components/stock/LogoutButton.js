'use client'; // 이 파일은 브라우저에서 실행됨!

import { supabase } from '@/utils/supabase/client'; // 클라이언트용 리모컨
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/main'); // 로그인 페이지로 이동
    router.refresh();      // 페이지 상태 초기화
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-5 py-5 hover:text-red-500 font-medium text-gray-800 text-lg transition-colors"
    >
      로그아웃
    </button>
  );
}