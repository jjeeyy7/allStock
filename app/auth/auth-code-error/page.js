// app/auth/auth-code-error/page.js
export default function AuthCodeError() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>로그인 중 오류가 발생했습니다.</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
      <a href="/">홈으로 돌아가기</a>
    </div>
  );
}