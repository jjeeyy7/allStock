'use server';

import { createClient } from '@/utils/supabase/server'; 

export async function checkExistingUser(email) {
    // ⚠️ 앞에 반드시 await를 붙여서 리모컨을 완전히 꺼내와야 합니다!
    const supabase = await createClient(); 
    
    const { data, error } = await supabase
        .from('profiles') 
        .select('email')
        .eq('email', email)
        .maybeSingle(); 
        
    return { data, error };
}


export async function createUserProfile(userId, email, password) {
    const supabase = await createClient();
    
    // upsert: 없으면 생성, 있으면 업데이트 (onConflict로 id 기준 중복 확인)
    const { data, error } = await supabase
        .from('profiles')
        .upsert([{ 
            id: userId, 
            email: email,
            created_at: new Date().toISOString()
        }], { onConflict: 'id' }); 
        
    return { data, error };
}

export async function updateUserPin(userId, pinCode) {
    const supabase = await createClient();
    
    // 유저의 고유 ID(userId)를 찾아서, pin_code 컬럼에 새로운 번호(pinCode)를 저장합니다.
    const { data, error } = await supabase
        .from('profiles')
        .update({ pin_code: pinCode }) // DB 컬럼명이 pin_code라고 가정했습니다!
        .eq('id', userId);
        
    return { data, error };
}