// app/stock/actions.js
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveProductOnServer(formData) {
  const supabase = await createClient();
  
  // user_id를 가져오기 위해 인증 확인 (보안 필수!)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  let finalIconId = formData.icon_id;

  // 이미지 업로드 로직 생략 (기존과 동일하게 유지 가능)
  // ... (여기에 기존 이미지 업로드 로직을 넣으세요) ...

  const insertData = {
    name: formData.name,
    category_id: formData.category || null,
    unit_id: formData.unit_id || null,
    option: formData.option,
    location: formData.location,
    stock: parseInt(formData.stock || 0),
    total: parseInt(formData.total || 0),
    min_stock: parseInt(formData.min_stock || 0),
    purchase_link: formData.purchase_link,
    memo: formData.memo,
    icon_id: finalIconId || null,
    last_updated: formattedDate,
    user_id: user.id // 🔑 내 재고인지 구분하는 핵심!
  };

  if (formData.id) {
    await supabase.from('items').update(insertData).eq('id', formData.id).eq('user_id', user.id);
  } else {
    await supabase.from('items').insert([insertData]);
  }

  revalidatePath('/stock');
}

export async function deleteProductOnServer(item_id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  await supabase.from('items').delete().eq('id', item_id).eq('user_id', user.id);
  revalidatePath('/stock');
}


