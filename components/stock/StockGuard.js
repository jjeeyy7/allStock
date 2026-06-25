'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function StockGuardContainer({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 1. 인증 상태가 바뀔 때마다 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("인증 상태 변경됨:", event, session);
            
            if (session) {
                setIsChecking(false); // 로그인 성공!
            } else if (event === 'SIGNED_OUT') {
                router.replace('/main'); // 로그아웃 시 튕기기
            }
        });

        // 2. 처음 페이지 들어왔을 때 딱 한 번만 세션 체크
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // 세션이 없으면 로그인 페이지로
                router.replace('/main');
            } else {
                setIsChecking(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    // 💡 화면이 깜빡거리거나 잘못된 접근이 뜨지 않도록 처리
    if (isChecking) return <div>데이터 동기화 중...</div>;

    return <>{children}</>;
}