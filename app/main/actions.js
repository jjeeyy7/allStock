'use server';

import { createClient } from '@/utils/supabase/server';

export async function loginUser(email, password) {
    const supabase = await createClient();

    // 1. 진짜 인증 시도
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password, 
    });

    if (error) {
        return { data: null, error: { message: "이메일이나 핀 번호가 일치하지 않습니다." } };
    }

    // 2. getUser()를 다시 부를 필요 없이, 여기서 data.user를 확인하면 됩니다!
    console.log("로그인 성공! 유저 ID:", data.user.id);

    return { data, error: null };
}

export async function loginAction(email, password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  
  // 성공 시 쿠키가 자동으로 설정됩니다.
  return { success: true };
}