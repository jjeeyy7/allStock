'use client';
import Image from 'next/image';
import KakaoLoginForm from '@/components/main/KakaoLoginForm.js';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import { Mail, Lock } from 'lucide-react';

// ✅ 1. 서버 액션(loginUser) 지우고, 우리가 만든 '클라이언트 리모컨'을 가져옵니다.
import { supabase } from '@/utils/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const isSubmitting = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting.current) return;

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!email || !isValid) {
            setError(true);
        } else {
            setError(false);
            isSubmitting.current = true;
            setIsLoading(true);

            const formattedEmail = email.toLowerCase().trim();

            // ✅ 2. 여기서 서버 액션 대신, 클라이언트에서 "직접" 로그인합니다!
            // 이렇게 하면 로컬스토리지에 인증 토큰이 100% 꽂힙니다.
            const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
                email: formattedEmail,
                password: password,
            });

            isSubmitting.current = false;
            setIsLoading(false);

            if (loginError) {
                console.error("로그인 실패:", loginError.message);

                // 에러 메시지가 'Invalid login credentials' (정보 불일치)일 경우
                if (loginError.message?.includes("Invalid login credentials")) {
                    alert("이메일 또는 핀 번호가 일치하지 않습니다. 다시 확인해주세요!");
                } else {
                    // 혹시 모를 다른 에러 (네트워크 끊김 등)
                    alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
                }

                return; // 여기서 함수를 끝내서 메인 페이지로 안 넘어가게 막습니다!
            } else {
                console.log("로그인 성공!", userData);
                // 강제 새로고침으로 완벽하게 이동
                window.location.href = '/stock';
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                {/* 헤더 섹션 */}
                <div className="flex items-center justify-center gap-3 mb-15">
                    <Image src="/icon/logo.png" alt="Logo" width={70} height={70} />
                    <span className="text-[40px] font-semibold text-gray-800">All Stock</span>
                    <div>  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">이메일</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 block">패스워드</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                {/* 구분선 */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-400 font-medium">또는 소셜 계정으로 로그인</span>
                    </div>
                </div>

                {/* 소셜 로그인 버튼 구역 */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-all">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.42 3.68 1.58 7.58l3.75 2.91C6.2 7.22 8.87 5.04 12 5.04z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.67 2.84c2.14-1.97 3.38-4.88 3.38-8.48z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.33 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.58 7.32C.57 9.34 0 11.61 0 14s.57 4.66 1.58 6.68l3.75-2.91z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.67-2.84c-1.1.74-2.51 1.18-4.29 1.18-3.13 0-5.8-2.18-6.75-5.45L.5 15.89C2.34 20.32 6.81 23 12 23z"
                            />
                        </svg>
                        Google
                    </button>
                    {/* 카카오 로그인 버튼 */}
                    <KakaoLoginForm />
                </div>

                {/* 회원가입 링크 */}
                <p className="text-center text-sm text-slate-500 mt-8">
                    아직 계정이 없으신가요?{' '}
                    <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                        회원가입하기
                    </a>
                </p>

            </div>
        </div>
    );
}