import Image from 'next/image';
import SearchButton from '@/components/stock/SearchButton';
import StockContainer from '@/components/stock/StockContainer';
import OpenForm from '@/components/stock/OpenForm';
import CategorySelect from '@/components/stock/CategorySelect';
import LogoutButton from '@/components/stock/LogoutButton';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function InventoryPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/main');
  }

  // --- 서버 액션: 저장 로직 ---
  async function saveProductOnServer(formData) {
    "use server";
    const supabase = await createClient();

    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

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
      icon_id: formData.icon_id || null,
      last_updated: formattedDate,
      user_id: user.id
    };

    if (formData.id) {
      await supabase.from('items').update(insertData).eq('id', formData.id).eq('user_id', user.id);
    } else {
      await supabase.from('items').insert([insertData]);
    }
    revalidatePath('/stock');
  }

  // --- 서버 액션: 삭제 로직 ---
  async function deleteProductOnServer(item_id) {
    "use server";
    const supabase = await createClient();
    await supabase.from('items').delete().eq('id', item_id).eq('user_id', user.id);
    revalidatePath('/stock');
  }

  // 데이터 로딩
  const params = await searchParams;
  const selectedCategory = params?.category || "";

  let itemsQuery = supabase
    .from('items')
    .select('*, categories!inner(categories_name), units(unit_name), icons(icon_url)')
    .eq('user_id', user.id)
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

  return (
    <div className="min-h-screen bg-[#eae6e6] font-sans text-gray-800">
      <header className="flex items-center bg-white border-b border-gray-200">
        <div className="flex items-center px-6 py-3 font-bold gap-2">
          <Image src="/icon/logo.png" alt="Logo" width={40} height={40} />
          <Link href="/stock"><span className="text-2xl font-normal cursor-pointer">All Stock</span></Link>
        </div>
        <nav className="flex h-full">
          <button className="px-5 py-5 bg-[#e2dfdf] font-semibold text-black text-lg">재고현황</button>
          <button className="px-5 py-5 hover:bg-gray-50 font-medium text-gray-800 text-lg">대시보드</button>
          <button className="px-5 py-5 hover:bg-gray-50 font-medium text-gray-800 text-lg">설정</button>
          <button className="px-5 py-5 hover:bg-gray-50 font-medium text-gray-800 text-lg">내정보</button>
        </nav>
        <div className="ml-auto flex items-center hover:bg-red-100  px-6"><LogoutButton /></div>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex-1 max-w-[400px] flex items-center bg-transparent border border-gray-500 rounded-full px-4 py-1.5">
            <input type="text" className="bg-transparent outline-none w-full text-lg" />
            <SearchButton />
          </div>
          <div className="flex items-center gap-6">
            <CategorySelect allCategories={categoriesResponse.data} selectedCategory={selectedCategory} />
            <OpenForm
              modalType="add"
              allCategories={categoriesResponse.data}
              allUnits={unitsResponse.data}
              iconList={iconsResponse.data}
              onSave={saveProductOnServer}
              onDelete={deleteProductOnServer}
            />
          </div>
        </div>

        <StockContainer
          stockItems={itemsResponse.data}
          allCategories={categoriesResponse.data}
          allUnits={unitsResponse.data}
          iconList={iconsResponse.data}
          onSaveAction={saveProductOnServer}
          onDelete={deleteProductOnServer}
        />
      </main>
    </div>
  );
}