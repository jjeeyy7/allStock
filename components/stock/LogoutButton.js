// LogoutButton.js
'use client';
import { logoutAction } from '@/app/stock/logoutAction';

export default function LogoutButton() {
  return (
    <div className="ml-auto flex items-center hover:bg-red-100 px-6">
      <button className="ml-auto flex items-center hover:bg-red-100 px-6 cursor-pointer" onClick={() => logoutAction()}>로그아웃</button>
    </div>
  );
}