"use client";
import { useState } from 'react';
import ProductForm from '@/components/stock/ProductForm';
import AddStockButton from '@/components/stock/AddStockButton'; // 경로 확인해주세요!

export default function OpenForm({ modalType, itemData, allCategories, allUnits, iconList, onSave, onDelete }) {
    // 딱 이거 하나만 있으면 됩니다!
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            {modalType === "add" ? (
                <AddStockButton onOpen={() => setIsModalOpen(true)} />
            ) : (
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="p-2 hover:bg-gray-200 rounded-full"
                >
                    <img src="/icon/settings.png" alt="설정 아이콘" width={17} height={17} />
                </button>
            )}

            {isModalOpen && (
                <ProductForm 
                    type={modalType} 
                    data={modalType === "add" ? null : itemData} // 추가면 null, 수정이면 해당 데이터 전달
                    allCategories={allCategories}
                    allUnits={allUnits}
                    iconList={iconList}
                    onClose={() => setIsModalOpen(false)} // 닫기 누르면 스위치 끔
                    onSave={onSave}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}