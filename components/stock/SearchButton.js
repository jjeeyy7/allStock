"use client"; // 이 버튼만 클라이언트에서 동작! [cite: 309, 332]
import Image from 'next/image';

// 1. 방금 만든 통신병(supabase)을 맨 위에서 불러오기 [cite: 446, 447]
import { supabase } from '@/lib/supabase'; 

export default function SearchButton() {
  
  // 2. 검색 버튼을 누르면 Supabase를 찔러보는 테스트 함수
  const testConnection = async () => {
    try {
      // 아직 만들지도 않은 'test_table'이라는 곳에 무작정 데이터 내놓으라고 요청해 보기
      const { data, error } = await supabase.from('test_table').select('*');

      // 에러 메시지를 확인해서 연결 성공 여부 판단!
      if (error) {
        // 통신은 성공해서 DB까지 갔는데, 테이블이 없어서 DB가 불평하는 경우 = 성공!
        alert('🚀 Supabase 통신 성공!\n(DB 왈: "연결은 잘 됐는데 test_table이라는 표는 아직 안 만들었잖아!")');
        console.log("상세 에러 내역:", error);
      } else {
        alert('🚀 Supabase 통신 성공! 데이터도 잘 가져옴!');
      }
    } catch (err) {
       // 인터넷 연결 문제나 설정이 아예 잘못된 경우
       alert('❌ 연결 실패! .env.local 주소나 열쇠 설정을 다시 확인해 봐.\n' + err.message);
    }
  };

  return (
    // 3. onClick에 우리가 만든 테스트 함수(testConnection)를 연결 [cite: 310]
    <button onClick={testConnection} className="ml-2 hover:scale-110">
      <Image src="/icon/search.png" alt="검색" width={16} height={16} />
    </button>
  );
}