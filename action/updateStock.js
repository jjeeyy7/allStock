// action/updateStock.js
'use server'
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache'; // 💡 이 줄이 꼭 있어야 해요!

export async function updateStock(id, newStock) {
  const { data, error } = await supabase
    .from('items')
    .update({ stock: newStock })
    .eq('id', id)
    .order('id', { ascending: true });

  if (error) {
    console.error("DB 수정 실패:", error);
    return;
  }

  revalidatePath('/stock'); // 💡 이 명령어가 화면을 다시 그려줘요!
}