'use client';
import Image from 'next/image';

export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick} className="ml-2 hover:scale-110">
      <Image src="/icon/search.png" alt="검색" width={16} height={16} />
    </button>
  );
}