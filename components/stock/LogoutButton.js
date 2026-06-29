// LogoutButton.js
'use client';
import { logoutAction } from '@/app/stock/logoutAction';

export default function LogoutButton() {
  return (
    <button onClick={() => logoutAction()}>로그아웃</button>
  );
}