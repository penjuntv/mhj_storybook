/* ===== 리셋 & 기본 설정 ===== */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  padding: 0;
  margin: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Pretendard",
    system-ui, sans-serif;
  background: #fff6ea;
  color: #4a321c;
}

/* 링크 기본색 제거 */
a {
  color: inherit;
  text-decoration: none;
}

/* ===== 페이지 레이아웃 ===== */

.page-root {
  max-width: 1200px;
  margin: 40px auto 80px;
  padding: 0 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

/* 언어 토글 */

.lang-switch {
  display: flex;
  gap: 8px;
}

.lang-switch button {
  min-width: 44px;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  background: #ffe3c2;
  color: #88502a;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  transition: background 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease;
}

.lang-switch button.active {
  background: #f7943a;
  color: #fff8f0;
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}

/* ===== STEP 공통 섹션 ===== */

.step-section {
  background: #ffe8c9;
  border-radius: 40px;
  padding: 32px 32px 36px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
}

.step-section h2 {
  font-size: 1.3rem;
  margin: 0 0 12px;
  font-weight: 700;
}

.step-section p {
  margin: 0 0 20px;
  font-size: 0.98rem;
  line-height: 1.5;
}

/* ===== 알파벳 선택 (A~Z, 26개 버튼) ===== */

.alphabet-picker {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 두 줄 사이 간격 */
  margin: 8px 0 18px;
}

.alphabet-row {
  display: flex;
  flex-wrap: nowrap; /* 한 줄에 13개 고정 */
  gap: 8px;
}

.alphabet-button {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: #fff7ee;
  color: #8b5a32;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease, color 0.15s ease;
}

.alphabet-button:hover {
  background: #ffe0bf;
}

.alphabet-button.active {
  background: #f8943b;
  color: #fffdf7;
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.17);
}

/* ===== 단어 카드 그리드 (3 x 2) ===== */

/* Word cards grid – 3 x 2, 카드가 영역을 넘치지 않도록 정렬 */
.word-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.word-card {
  background: #fce4c6; /* 기존 톤에 맞게 살짝 밝은 베이지 */
  border-radius: 28px;
  border: none;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.word-card:focus {
  outline: 2px solid #f7a24a;
  outline-offset: 2px;
}

.word-card-image-wrapper {
  width: 100%;
  aspect-ratio: 4 / 5; /* 항상 직사각형 비율 유지 */
  border-radius: 24px;
  overflow: hidden;
  background: #ffeeda;
}

.word-card-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain; /* 카드 안에서 전체가 보이도록 약간 여백 허용 */
}

/* 카드가 없을 때 문구 */
.word-grid-empty {
  margin-top: 24px;
  font-size: 0.95rem;
  color: #8a6a4a;
}

/* ===== STEP1 – 입력창 + 칩 ===== */

.word-input-block {
  margin-top: 28px;
}

.word-input-block label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.word-input-row {
  display: flex;
  gap: 8px;
}

.word-input-row input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(173, 124, 82, 0.3);
  font-size: 0.95rem;
}

.word-input-row button {
  padding: 0 16px;
  border-radius: 16px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  background: #f8943b;
  color: #fffaf4;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.chips-hint {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #8a6a4a;
}

.chips-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  position: relative;
  padding: 6px 24px 6px 12px;
  border-radius: 999px;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  background: #fff4e3;
  color: #7f4d27;
}

.chip.must {
  background: #fbb257;
  color: #4a2b15;
}

.chip-close {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
}

/* ===== STEP2 – 이야기 옵션 폼 ===== */

.step2-story {
  margin-top: 12px;
}

.step2-row {
  margin-bottom: 18px;
}

.input-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.text-input {
  width: 100%;
  max-width: 320px;
  padding: 8px 11px;
  border-radius: 16px;
  border: 1px solid rgba(173, 124, 82, 0.3);
  font-size: 0.95rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.theme-group {
  max-width: 620px;
}

.pill-button {
  border-radius: 999px;
  border: none;
  padding: 8px 14px;
  font-size: 0.9rem;
  cursor: pointer;
  background: #ffe7cf;
  color: #7f4d27;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease;
}

.pill-button.active {
  background: #f8943b;
  color: #fffaf4;
  transform: translateY(1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
}

/* ===== 이야기 요청 버튼 ===== */

.request-row {
  margin-top: 12px;
  margin-bottom: 20px;
}

.request-row button {
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  font-size: 0.98rem;
  cursor: pointer;
  background: #f66d3b;
  color: #fff7ef;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* ===== 결과 영역 ===== */

.story-result {
  margin-top: 16px;
}

.section-title {
  font-size: 1.1rem;
  margin: 0 0 8px;
  font-weight: 700;
}

.error-text {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: #b6392b;
}

.story-box {
  margin-top: 6px;
  background: #fff9f1;
  border-radius: 24px;
  padding: 18px 20px;
  min-height: 140px;
  box-shadow: inset 0 0 0 1px rgba(250, 211, 160, 0.5);
}

.story-text {
  white-space: pre-wrap;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.story-placeholder {
  margin: 0;
  font-size: 0.9rem;
  color: #a37a4d;
}

/* ===== 반응형 살짝 조정 ===== */

@media (max-width: 900px) {
  .page-root {
    margin-top: 24px;
    padding: 0 16px;
  }

  .step-section {
    padding: 24px 18px 28px;
    border-radius: 28px;
  }

  .word-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .word-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .alphabet-row {
    flex-wrap: wrap;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
