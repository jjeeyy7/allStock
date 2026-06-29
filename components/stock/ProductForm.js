"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Draggable from 'react-draggable';

export default function ProductForm({ type, data, allCategories, allUnits, iconList, onClose, onSave, onDelete }) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

    const [form, setForm] = useState({
        id: data?.id || "",
        name: data?.name || "",
        category: data?.category_id || "",
        unit_id: data?.unit_id || "",
        option: data?.option || "",
        location: data?.location || "",
        stock: data?.stock || "",
        total: data?.total || "",
        min_stock: data?.min_stock || "",
        purchase_link: data?.purchase_link || "",
        memo: data?.memo || "",
        icon_id: data?.icon_id || "",
        last_updated: data?.last_updated || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        setImageFile(file); // 👈 💡 부모한테 줄 진짜 파일을 주머니에 챙김!
        setForm({ ...form, icon_id: "" }); // (선택) 직접 올리면 기존 아이콘 선택은 해제
    };

    const [showDropdown, setShowDropdown] = useState(false);

    const [preview, setPreview] = useState(data?.icons?.icon_url || "");

    const [imageFile, setImageFile] = useState(null);

    const nodeRef = useRef(null);

    // 1. 파라미터(form)를 깔끔하게 지웁니다! (e)만 받거나 비워둬도 됩니다.
    const handleSaveProduct = async (e) => {
        try {
            // 💡 이제 진짜 우리가 만든 'form' 상태(바구니)를 검사합니다!
            if (!form.name) {
                alert("제품 이름을 입력해주세요!");
                return;
            }

            if (form.name.length >= 8) {
                alert("제품 이름은 7글자 이하로 입력해주세요!");
                return;
            }

            if (!form.category) {
                alert("카테고리를 지정해주세요");
                return;
            }

            if (form.option.length >= 60) {
                alert("옵션은 60글자 이하로 입력해주세요!");
                return;
            }

            if(!Number.isInteger(Number(form.stock)) || !Number.isInteger(Number(form.total)) || !Number.isInteger(Number(form.min_stock))) {
                alert("재고 수량은 정수로 입력해주세요!");
                return;
            }   

            if (Number(form.stock) > Number(form.total)) {
                alert("현재 재고량이 총 수량을 초과할 수 없습니다.");
                return;
            }

            if (Number(form.min_stock) > Number(form.total)) {
                alert("최소 재고 설정값이 총 수량을 초과할 수 없습니다.");
                return;
            }

            if (Number(form.total) < 0 || Number(form.stock) < 0 || Number(form.min_stock) < 0) {
                alert("재고 수량은 0보다 작을 수 없습니다.");
                return;
            }

            // 💡 2. 부모에게 보낼 최종 데이터 예쁘게 포장하기
            const finalData = {
                ...form,                 // 바구니에 있던 텍스트 정보들 다 붓고
                id: data?.id || null,    // 수정일 경우 기존 제품 ID 챙기고
                newImageFile: imageFile, // 새로 첨부한 이미지 파일도 챙김!
            };

            // 💡 3. onSaveAction이 아니라 부모가 준 'onSave' 실행!
            await onSave(finalData);

            alert("성공적으로 저장되었습니다");

            // 💡 (보너스) 성공적으로 저장되면 팝업을 알아서 닫아줍니다!
            if (onClose) onClose();

        } catch (error) {
            console.error(error);
            alert("저장에 실패했습니다.");
        }
    };

    // ProductForm.js 내의 함수
    const handleDeleteProduct = async (e) => {
        e.preventDefault();
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            // 💡 form.id 대신, 이 폼이 수정하려고 열려있을 때 받은 data.id 사용!
            await onDelete(data.id);
            alert("삭제되었습니다.");
            if (onClose) onClose();
        } catch (error) {
            console.error(error);
            alert("삭제 실패했습니다.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >

            <div className="bg-[#eae6e6] p-6 rounded-xl max-w-[420px] w-full mx-auto">
                <div className="font-medium text-[20px] relative w-full">
                    {type === "add" ? (
                        "상품 추가"
                    ) : (
                        "상품 수정"
                    )}
                    {type === "edit" && (
                        <button onClick={handleDeleteProduct} className="absolute right-0 top-0 bg-red-500 hover:bg-red-700 text-white text-[15px] px-2 py-0.5 rounded shadow-sm transition-colors" >
                            삭제
                        </button>
                    )}

                </div>
                {/* 아이콘 + 기본 정보 */}
                <div className="flex gap-4 mb-5 items-start">
                    <div className="flex flex-col items-center gap-1.5 shrink-0 relative">
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-20 h-20 bg-white border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative"
                        >
                            <Image src={preview || form.icon_id || "/icon/box.png"} alt="아이템 사진" fill className="object-cover" />
                            {preview ? (
                                <Image src={preview} alt="미리보기" fill className="object-cover" />
                            ) : (
                                <span className="text-gray-300 text-3xl">+</span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">아이콘</span>

                        {/* 드롭다운 영역 */}
                        {showDropdown && (
                            <Draggable nodeRef={nodeRef}>
                                <div ref={nodeRef} className="absolute top-0 right-25 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-52 z-50 flex flex-col gap-5 cursor-move">
                                    {/* 기존 아이콘 목록 (3칸씩 나열) */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {iconList.map((icon, idx) => (
                                            <div
                                                key={idx}
                                                className="w-12 h-12 border rounded cursor-pointer relative overflow-hidden hover:border-blue-500"
                                                onClick={() => {
                                                    // 선택한 아이콘 업데이트 로직
                                                    setPreview(icon.icon_url);
                                                    setForm({ ...form, icon_id: icon.icon_id }); // icon_url 대신 id 저장
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                <Image src={icon.icon_url || "/icon/box.png"} alt="icon" fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* 새 이미지 업로드 버튼 */}
                                    <label className="text-center text-sm bg-gray-100 hover:bg-gray-200 border rounded py-1.5 cursor-pointer text-gray-700">
                                        + 사진 추가
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                handleImage(e);
                                                setShowDropdown(false);
                                            }}
                                        />
                                    </label>

                                </div>
                            </Draggable>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        {[
                            { label: "제품명", name: "name", type: "text" },
                            { label: "단위", name: "unit", type: "text" },
                            { label: "사양", name: "option", type: "text" },
                        ].map(({ label, name, type }) => (
                            <div key={name} className="flex items-center gap-2">
                                <label className="text-sm text-gray-500 min-w-[48px]">{label}</label>
                                {name === "unit" ? (
                                    <select
                                        name="unit_id"
                                        value={form.unit_id}
                                        onChange={handleChange}
                                        className="flex-1 h-8 border border-gray-300 rounded px-2 text-sm bg-white outline-none" >
                                        {allUnits?.map((unitItem) => (
                                            <option key={unitItem.unit_id} value={unitItem.unit_id}>
                                                {unitItem.unit_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        className="flex-1 h-8 border border-gray-300 rounded px-2 text-sm bg-white outline-none"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500 min-w-[48px]">분류</label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="flex-1 h-8 border border-gray-300 rounded px-2 text-sm bg-white outline-none" >
                                <option value="">선택해주세요</option>
                                {allCategories?.map((category) => (
                                    <option key={category.categories_id} value={category.categories_id}>
                                        {category.categories_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 상세 정보 */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 mb-5">
                    {[
                        { label: "보관 위치", name: "location", type: "text" },
                        { label: "잔여량", name: "stock", type: "number" },
                        { label: "총 개수", name: "total", type: "number" },
                        { label: "최소 재고량", name: "min_stock", type: "number" },
                        { label: "구매 링크", name: "purchase_link", type: "url" },
                    ].map(({ label, name, type }) => (
                        <div key={name} className="flex items-center gap-3">
                            <label className="text-sm text-gray-500 min-w-[72px]">{label}</label>
                            {name === "purchase_link" ? (
                                <div className="flex flex-col gap-1 w-full">
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name] || ""}
                                        onChange={handleChange}
                                        className="flex-1 h-8 border border-gray-300 rounded px-2 text-sm bg-white outline-none"
                                    />
                                    {form[name] && (
                                        <a href={form[name]} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline ml-1">
                                            🔗 등록된 링크 바로가기
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type={type}
                                    name={name}
                                    value={form[name] || ""}
                                    onChange={handleChange}
                                    className="flex-1 h-8 border border-gray-300 rounded px-2 text-sm bg-white outline-none"
                                />
                            )}
                        </div>
                    ))}
                    {/* 비고란 (중복 제거 후 여기로 통합) */}
                    <div className="flex items-start gap-3">
                        <label className="text-sm text-gray-500 min-w-[72px] pt-1.5">비고</label>
                        <textarea
                            name="memo"
                            value={form.memo}
                            onChange={handleChange}
                            rows={3}
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm bg-white outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-5 text-sm">
                    <span className="text-gray-500">마지막 업데이트 날짜</span>
                    <span className="text-gray-800">{form.last_updated || "등록되지 않음"}</span>
                </div>

                <div className="flex gap-3">
                    <button onClick={handleSaveProduct} className="flex-1 h-11 bg-[#4a7ef5] text-white rounded-lg font-medium hover:opacity-90">저장</button>
                    <button onClick={onClose} className="flex-1 h-11 bg-[#e8454a] text-white rounded-lg font-medium hover:opacity-90">취소</button>
                </div>
            </div>
        </div>
    );
}