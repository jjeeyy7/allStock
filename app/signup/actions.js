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

export async function createUserProfile(email) {
    const supabase = await createClient();
    
    // DB에 데이터 삽입
    const { data, error } = await supabase
        .from('profiles')
        .insert([{ email: email, created_at: new Date() }]);
        
    return { data, error };
}