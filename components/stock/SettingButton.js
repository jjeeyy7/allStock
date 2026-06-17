"use client";
import Image from 'next/image';

export default function SettingButton({ onOpen }) {
  return (
    <button onClick={onOpen} className="p-2 hover:bg-gray-200 rounded-full">
      <Image src="/icon/settings.png" alt="설정 아이콘" width={17} height={17} />
    </button>
  );
}