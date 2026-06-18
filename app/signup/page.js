'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Lock, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SignupForm() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e) => { // 1. async 추가
        e.preventDefault();

        console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            alert("환경 변수가 설정되지 않았습니다!");
            return;
        }

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!email || !isValid) {
            setError(true);
        } else {
            setError(false);

            // 2. 여기서 진짜로 Supabase에 메일 보내달라고 요청!
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: 'https://allstock.cloud/auth/callback',
                },
            });
            // 3. 서버 응답 확인
            if (error) {
                console.error('메일 발송 에러:', error.message);
                alert('메일 발송 중 문제가 생겼어요.');
                console.error('메일 발송 에러 상세 내용:', error);
            } else {
                // 4. 에러가 없을 때만 성공 화면으로 전환
                setIsSuccess(true);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
            <div className="bg-white w-full max-w-4xl min-h-[500px] rounded-[40px] shadow-xl flex flex-col md:flex-row overflow-hidden">

                {/* 오른쪽: 폼 영역 */}
                <div className="flex-[1.2] p-8 md:p-12 bg-white flex flex-col justify-center">
                    {!isSuccess ? (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">안녕하세요 👋</h2>
                            <p className="text-slate-500 mb-8 text-lg">아래 이메일을 입력하시고 가입하기 버튼을 눌러 가입을 진행해주세요. </p>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-slate-600">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError(false);
                                            }}
                                            placeholder="hello@example.com"
                                            className={`w-full py-4 pl-12 pr-4 rounded-2xl border-2 outline-none transition-all ${error
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-slate-200 bg-slate-50 focus:border-[#bc84ee] focus:bg-white focus:ring-4 focus:ring-purple-100'
                                                }`}
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm mt-2">앗, 올바른 이메일 주소를 입력해 주세요!</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-[#bc84ee] hover:-translate-y-1 hover:shadow-lg transition-all flex justify-center items-center gap-2"
                                >
                                    가입하기 <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-center text-sm text-slate-400 mt-5 flex justify-center items-center gap-1">
                                    <Lock className="w-4 h-4 text-[#bc84ee]" /> 개인정보를 철저히 보호하며, 스팸 메일은 절대 발송하지 않습니다.
                                </p>
                            </form>
                        </div>
                    ) : (
                        /* 가입 성공 화면 */
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-[#dcfd8b] rounded-full flex justify-center items-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-slate-800" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">You're in! 🎉</h3>
                            <p className="text-slate-500 text-lg mb-13">확인 메일을 보냈습니다.<br />이메일함을 확인해 주세요!</p>

                            <a href="/main" className="text-[17px] bg-[#dcfd8b]">
                                로그인하러가기
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}