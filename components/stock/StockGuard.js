'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function StockGuardContainer({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. 이미 로그인된 상태인지 확인
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // 세션이 없으면 로그인 페이지로 이동
        router.replace('/main');
      } else {
        setIsAuth(true);
        setLoading(false);
      }
    };

    checkSession();

    // 2. 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuth(true);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setIsAuth(false);
        router.replace('/main');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) return <div>로딩 중...</div>;
  if (!isAuth) return null;

  return <>{children}</>;
}