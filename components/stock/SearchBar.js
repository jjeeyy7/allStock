'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // router 사용
import SearchButton from './SearchButton';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    // URL의 쿼리 파라미터를 바꿉니다. (예: /stock?search=사과)
    router.push(`/stock?search=${searchTerm}`);
  };

  return (
    <div className="flex-1 max-w-[400px] flex items-center bg-transparent border border-gray-500 rounded-full px-4 py-1.5">
      <input 
        type="text" 
        className="bg-transparent outline-none w-full text-lg" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상품 검색..."
      />
      <SearchButton onClick={handleSearch} />
    </div>
  );
}