'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function StockGuardContainer({ children }) {
    const router = useRouter();
    const supabase = createClient();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // 1. 로그인된 유저가 있는지 신분증 검사
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // 2. 로그인 안 했으면 경고 띄우고 쫓아내기!
                alert('잘못된 접근입니다. 먼저 로그인을 해주세요! 🚨');
                router.push('/main'); 
            } else {
                // 3. 로그인했으면 통과!
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router, supabase]);

    // 검사 중일 때는 화면 노출을 완전히 차단합니다 (번쩍임 방지)
    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 font-bold text-xl text-slate-600">
                신분증 확인 중... 🧐
            </div>
        );
    }

    // 검사 통과하면 감싸고 있던 진짜 주식 화면(children)을 보여줍니다!
    return <>{children}</>;
}