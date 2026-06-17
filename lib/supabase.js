import { createClient } from '@supabase/supabase-js';

// 금고(.env.local)에서 주소와 열쇠를 꺼내옴
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase와 연결된 통신병(supabase)을 밖으로 내보냄!
export const supabase = createClient(supabaseUrl, supabaseKey);