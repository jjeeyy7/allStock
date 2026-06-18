'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Lock, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// 객체 재생성 및 세션 혼선 방지를 위해 컴포넌트 외부에서 단 한 번만 선언
const supabase = createClient();

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isComplete, setIsComplete] = useState(false); // 인증 완료 화면 제어 상태
    const [otp, setOtp] = useState('');

    // 1단계: 이메일 입력 후 인증번호 발송 요청
    const handleSubmit = async (e) => {
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

            console.log("Supabase URL 확인:", process.env.NEXT_PUBLIC_SUPABASE_URL);
            console.log("Supabase Client 객체 확인:", supabase);

            const { error } = await supabase.auth.signInWithOtp({
                email: email.toLowerCase().trim(),
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('메일 발송 에러:', error.message);
                alert('메일 발송 중 문제가 생겼어요.');
                console.error('메일 발송 에러 상세 내용:', error);
            } else {
                setIsSuccess(true);
            }
        }
    };

    // 2단계: 사용자가 입력한 인증번호(OTP) 검증 요청
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.verifyOtp({
            email: email.toLowerCase().trim(),
            token: otp.trim(),
            type: 'magiclink', // 신규 회원가입 흐름은 'signup'을 사용해야 정확히 일치합니다.
        });

        if (error) {
            alert('인증번호가 올바르지 않습니다.');
            console.error(error);
        } else {
            setIsComplete(true); // 인증 성공 시 완료 화면 상태를 true로 전환
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
            <div className="bg-white w-full max-w-4xl min-h-[500px] rounded-[40px] shadow-xl flex flex-col md:flex-row overflow-hidden">

                {/* 폼 영역 */}
                <div className="flex-[1.2] p-8 md:p-12 bg-white flex flex-col justify-center">
                    {isComplete ? (
                        /* 3단계: 인증 완료 성공 화면 */
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md mx-auto">
                            <div className="w-20 h-20 bg-[#dcfd8b] rounded-full flex justify-center items-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-slate-800" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">인증 완료! 🎉</h3>
                            <p className="text-slate-500 text-lg mb-8">
                                인증이 성공적으로 되었습니다.<br />이제 서비스를 이용하실 수 있습니다.
                            </p>
                            <a 
                                href="/main" 
                                className="inline-block w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-[#bc84ee] hover:shadow-lg transition-all text-center"
                            >
                                시작하기
                            </a>
                        </div>
                    ) : !isSuccess ? (
                        /* 1단계: 이메일 입력 화면 */
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
                                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-[#bc84ee] hover:-translate-y-1 hover:shadow-lg transition-all flex justify-center items-center cursor-pointer gap-2"
                                >
                                    가입하기 <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-center text-sm text-slate-400 mt-5 flex justify-center items-center gap-1">
                                    <Lock className="w-4 h-4 text-[#bc84ee]" /> 개인정보를 철저히 보호하며, 스팸 메일은 절대 발송하지 않습니다.
                                </p>
                            </form>
                        </div>
                    ) : (
                        /* 2단계: OTP 인증번호 입력 화면 (마크업 구조 유지) */
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md mx-auto">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex justify-center items-center mx-auto mb-6">
                                <Mail className="w-10 h-10 text-[#bc84ee]" />
                            </div>
                            <h3 className="text-3xl font-bold mb-2">인증번호 입력 📩</h3>
                            <p className="text-slate-500 text-base mb-8">
                                {email}로 전송된<br />8자리 인증번호를 입력해 주세요.
                            </p>
                            <form onSubmit={handleVerifyOtp} noValidate>
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        maxLength={8}
                                        placeholder="00000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full py-4 text-center text-3xl font-bold tracking-[0.5em] pl-[0.5em] rounded-2xl border-2 border-slate-200 bg-slate-50 outline-none focus:border-[#bc84ee] focus:bg-white transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-[#bc84ee] hover:shadow-lg transition-all cursor-pointer"
                                >
                                    인증하기
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}