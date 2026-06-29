'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// 1. 클라이언트용 Supabase를 불러옵니다 (경로는 갓벽자님 설정에 맞게 변경하세요!)
import { supabase } from '@/utils/supabase/client'; 
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  // Supabase 리모컨 준비


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🚀 2. 카카오 로그인 전용 함수를 만듭니다
  const handleKakaoLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        // 아까 우리가 만든 콜백 라우트(/auth/callback)로 다시 돌아오라고 주소를 적어줍니다!
        // redirectTo: `https://pdkzxpdjcapqzhlswjxz.supabase.co/auth/v1/callback`, 
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('카카오 로그인 에러 ㅠㅠ:', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('이메일 로그인 시도:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ... (이메일/비밀번호 입력창 생략) ... */}

      {/* 소셜 로그인 버튼 구역 */}
      <div className="grid grid-cols-1 gap-3">
        {/* 3. 카카오 버튼에 onClick 달아주기! */}
        <button 
          type="button" // 🚨 중요: 폼 제출(submit)을 막기 위해 반드시 type="button"을 줍니다.
          onClick={handleKakaoLogin}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-[#000000] bg-[#FEE500] hover:bg-[#FDD800] active:bg-[#FCCC00] transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.85 1.83 5.34 4.56 6.77l-1.15 4.19c-.11.41.36.72.69.48l4.9-3.26c.33.02.66.04 1 .04 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
          </svg>
          카카오
        </button>
        
        {/* GitHub 버튼 생략 */}
      </div>
    </form>
  );
}