"use client";
import { updateStock } from '@/action/updateStock';

export default function StockButton({ id, currentStock, total }) {
  // 사용 버튼 클릭 로직
  const handleUse = async () => {
    await updateStock(id, currentStock - 1); // 1 감소
  };

  // 리필 버튼 클릭 로직
  const handleRefill = async () => {
    await updateStock(id, currentStock + 1); // 1 증가
  };

  return (
    <div className="flex gap-2">
      {/* 1. '사용' 버튼 영역 (품절 체크) */}
      {currentStock <= 0 ? (
        <div className="flex gap-2 bg-red-500 text-white font-bold py-2 px-14 rounded-md text-sm text-center cursor-not-allowed">
         품 절
        </div>
      ) : (
        <button 
          onClick={handleUse} 
          className="flex gap-2 justify-center bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-14 rounded-md text-sm"
        >
          - 사용
        </button>
      )}

      {/* 2. '리필' 버튼 영역 (언제든 클릭 가능) */}
      {currentStock >= total ? (
        <button disabled className="flex gap-2 justify-center bg-gray-300 text-gray-500 font-bold py-2 px-14 rounded-md text-sm cursor-not-allowed"
      >
        + 리필
      </button>
      ) : (
        <button 
        onClick={handleRefill} 
        className="flex gap-2 justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-14 rounded-md text-sm"
      >
        + 리필
      </button>
      )}
      
    </div>
  );
}