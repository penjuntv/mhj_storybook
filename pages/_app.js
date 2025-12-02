// pages/_app.js
import "../styles/globals.css";
import "../styles/coloring.css"; // 새로 만든 Step3 전용 CSS

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
