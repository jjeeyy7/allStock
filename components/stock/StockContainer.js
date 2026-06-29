"use client";
import Image from 'next/image';
import StockButton from '@/components/stock/StockButton';
import OpenForm from '@/components/stock/OpenForm'; // 경로 확인해주세요!

export default function StockContainer({ stockItems, allCategories, allUnits, iconList, onSaveAction, onDelete }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.isArray(stockItems) &&
        stockItems.map((item) => {
          const percent = item.total > 0 ? Math.round((item.stock / item.total) * 100) : 0;
          const imageUrl = item.icons?.icon_url || "/icon/box.png";

          return (
            <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm relative w-[358px] h-[250px] flex flex-col justify-between">

              {/* 💡 설정(수정) 버튼: map 싹 지우고 하나만 쏙! */}
              <div className="absolute top-5 right-5">
                <OpenForm
                  modalType="edit"
                  itemData={item}
                  allCategories={allCategories}
                  allUnits={allUnits}
                  iconList={iconList}
                  onSave={onSaveAction}
                  onDelete={onDelete}
                />
              </div>

              <div className="flex gap-4 mb-4 items-center">
                <div className="w-16 h-16 bg-white-200 rounded-lg flex items-center justify-center text-3xl border border-gray-300 overflow-hidden relative">
                  <Image src={imageUrl} alt="아이템 사진" fill sizes="50px" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600">
                    분류: {item.categories?.categories_name || "미지정"}
                  </p>
                  <p className="text-xs text-gray-600">옵션: {item.option || "-"}</p>
                </div>
              </div>

              {/* 진행 상태 바 */}
              <div className="mb-5">
                <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                  <span>남은 잔량 ({percent}%)</span>
                  <span>잔여 {item.stock}{item.units?.unit_name || ""}/총 {item.total}{item.units?.unit_name || ""}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div className={`${item.stock <= item.min_stock ? "bg-[#ff0000]" : "bg-[#5cba75]"} h-3 rounded-full`} style={{ width: `${percent}%` }} />
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex gap-3 items-center justify-center">
                <StockButton id={item.id} currentStock={item.stock} total={item.total} />
              </div>
            </div>
          );
        })
      }

      {!stockItems || stockItems.length === 0 ? (
        <div className="w-full text-center text-gray-500 py-20">
          등록된 재고가 없습니다.  <br /> 제품추가 버튼을 눌러 재고를 등록해보세요!
        </div>
      ) : null}
    </div>
  );
}
