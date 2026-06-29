// LogoutButton.js
'use client';
import { logoutAction } from '@/app/stock/logoutAction'; // 위에 만든 서버 액션

export default function LogoutButton() {
  return (
    <button onClick={() => logoutAction()}>로그아웃</button>
  );
}