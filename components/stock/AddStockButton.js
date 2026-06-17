"use client";

export default function AddStockButton({ onOpen }) {
  return (
    <button onClick={onOpen} className= "bg-blue-500 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow-sm transition-colors" >
      + 제품 추가
    </button>
  );
}