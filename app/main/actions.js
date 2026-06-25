'use server';

import { createClient } from '@/utils/supabase/server';

export async function loginUser(email, password) {
    
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, pin_code') // 핀 번호도 같이 가져와야 비교가 가능합니다!
        .eq('email', email)
        .maybeSingle(); 

    // 1. 에러가 발생했거나, 유저를 아예 못 찾은 경우
    if (error || !data) {
        return { data: null, error: { message: "등록되지 않은 이메일입니다." } };
    }

    // 2. 🔑 핵심 체킹: DB의 핀 번호와 입력한 핀 번호(password) 비교
    if (data.pin_code !== password) {
        return { data: null, error: { message: "핀 번호가 일치하지 않습니다." } };
    }

    // 3. 둘 다 통과하면 로그인 성공!
    return { data, error: null };
}