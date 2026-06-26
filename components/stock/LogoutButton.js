'use client'; // 이 파일은 브라우저에서 실행됨!

import { supabase } from '@/utils/supabase/client'; // 클라이언트용 리모컨
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/main';
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