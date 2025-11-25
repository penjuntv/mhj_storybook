// pages/index.js
export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>MHJ Storybook</h1>
        <p>빌드 정상 작동 중입니다.</p>
        <p>/api/story 도 POST 요청으로 사용할 수 있습니다.</p>
      </div>
    </div>
  );
}
