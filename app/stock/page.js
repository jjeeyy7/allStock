import Image from 'next/image';
import SearchButton from '@/components/stock/SearchButton';
import StockContainer from '@/components/stock/StockContainer';
import OpenForm from '@/components/stock/OpenForm';
import CategorySelect from '@/components/stock/CategorySelect';
import StockGuardContainer from '@/components/stock/StockGuard';
import LogoutButton from '@/components/stock/LogoutButton';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';


export default async function InventoryPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || "";

  let itemsQuery = supabase
    .from('items')
    .select('*, categories!inner(categories_name), units(unit_name), icons(icon_url)')
    .order('id', { ascending: false });

  if (selectedCategory) {
    itemsQuery = itemsQuery.eq('categories.categories_name', selectedCategory);
  }

  const [itemsResponse, categoriesResponse, unitsResponse, iconsResponse] = await Promise.all([
    itemsQuery, 
    supabase.from('categories').select('*').order('categories_id', { ascending: true }), 
    supabase.from('units').select('*').order('unit_id', { ascending: true }),
    supabase.from('icons').select('*').order('icon_id', { ascending: true }) 
  ]);

  const stockItems = itemsResponse.data;
  const allCategories = categoriesResponse.data;
  const allUnits = unitsResponse.data;
  const iconList = iconsResponse.data;

  if (itemsResponse.error || categoriesResponse.error || unitsResponse.error) {
    console.error("데이터 불러오기 에러:", itemsResponse.error || categoriesResponse.error || unitsResponse.error);
  }

  // 서버 액션 (저장 로직)
  async function saveProductOnServer(formData) {
    "use server";

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}.${month}.${day}`;

    let finalIconId = formData.icon_id;

    if (formData.newImageFile) {
      const file = formData.newImageFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('icons').upload(fileName, file);
      if (uploadError) throw new Error("이미지 업로드 에러: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage.from('icons').getPublicUrl(fileName);
      const newImageUrl = publicUrlData.publicUrl;

      const { data: newIconData, error: iconError } = await supabase.from('icons')
        .insert([{ icon_url: newImageUrl }]).select().single();

      if (iconError) throw new Error("아이콘 DB 저장 에러: " + iconError.message);
      finalIconId = newIconData.icon_id;
    }

    const insertData = {
      name: formData.name,
      category_id: formData.category || null,
      unit_id: formData.unit_id || null,
      option: formData.option,
      location: formData.location,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      total: formData.total ? parseInt(formData.total) : 0,
      min_stock: formData.min_stock ? parseInt(formData.min_stock) : 0,
      purchase_link: formData.purchase_link,
      memo: formData.memo,
      icon_id: finalIconId || null,
      last_updated: formattedDate,
    };

    let error;

    if (formData.id) {
      const { error: updateError } = await supabase.from('items').update(insertData).eq('id', formData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('items').insert([insertData]);
      error = insertError;
    }

    if (error) throw new Error(error.message);
    revalidatePath('/stock');
  }


  // 서버 액션 (삭제 로직)
  async function deleteProductOnServer(item_id) {
    "use server";
    const { error: deleteError } = await supabase.from('items').delete().eq('id', item_id);

    if (deleteError) throw new Error("삭제 실패: " + deleteError.message);

    revalidatePath('/stock');
  }

  return (
     <StockGuardContainer>
    <div className="min-h-screen bg-[#eae6e6] font-sans text-gray-800">

      <header className="flex items-center bg-white border-b border-gray-200">
        <div className="flex items-center px-6 py-3 font-bold gap-2">
          <Image src="/icon/logo.png" alt="Logo" width={40} height={40} />
          <Link href="/stock">
            <span className="text-2xl font-normal cursor-pointer">All Stock</span>
          </Link>
        </div>
        <nav className="flex h-full">
          <button className="px-5 py-5 bg-[#e2dfdf] font-semibold text-black text-lg">재고현황</button>
          <button className="px-5 py-5 hover:bg-gray-50 font-medium text-gray-800 text-lg">대시보드</button>
          <button className="px-5 py-5 hover:bg-gray-50 font-medium text-gray-800 text-lg">설정</button>
          <button className="px-5 py-5 hover:bg-gray-50 font-medium text-gray-800 text-lg">내정보</button>
        </nav>
      
        <div className="ml-auto flex items-center gap-4 px-6 ">
         <LogoutButton />
        </div>
        
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex-1 max-w-[400px] flex items-center bg-transparent border border-gray-500 rounded-full px-4 py-1.5">
            <input type="text" className="bg-transparent outline-none w-full text-lg" />
            <SearchButton />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">분류:</span>
              <CategorySelect
                allCategories={allCategories}
                selectedCategory={selectedCategory}
              />
            </div>
            {/* 상단 '+ 제품 추가' 버튼 */}
            <OpenForm
              modalType="add"
              itemData={null}
              allCategories={allCategories}
              allUnits={allUnits}
              iconList={iconList}
              onSave={saveProductOnServer}
              onDelete={deleteProductOnServer}
            />
          </div>
        </div>

        <div className="border-y border-gray-400 py-2 my-4 text-left text-md text-gray-600 font-medium">
          {!selectedCategory ? '등록된 아이템 전체' : `${selectedCategory} 목록`}
        </div>

        {/* 리스트 컨테이너 */}
        <StockContainer
          stockItems={stockItems}
          allCategories={allCategories}
          allUnits={allUnits}
          iconList={iconList}
          onSaveAction={saveProductOnServer}
          onDelete={deleteProductOnServer}
        />
      </main>
    </div>
    </StockGuardContainer>
  );
}
