// pages/_app.js
// 전역 스타일만 불러오는 Next.js 커스텀 App 컴포넌트

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
