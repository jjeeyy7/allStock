"use client"; // 💡 여기선 브라우저 이벤트(onChange)를 마음껏 쓸 수 있습니다!

export default function CategorySelect({ allCategories, selectedCategory }) {
  return (
    <select 
      value={selectedCategory} 
      onChange={(e) => {
        const val = e.target.value;
        // 💡 값이 있으면 주소창을 바꾸고, 없으면 전체 목록으로 리다이렉트!
        window.location.href = val ? `/stock?category=${val}` : '/stock';
      }}
      className="border border-gray-300 rounded px-4 py-1.5 bg-white outline-none appearance-none cursor-pointer"
    >
      <option value="">전체</option>
      {allCategories?.map((category, index) => (
        <option key={index} value={category.id}>
          {category.categories_name}
        </option>
      ))}
    </select>
  );
}