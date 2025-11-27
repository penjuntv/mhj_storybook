// pages/index.js
import { useMemo, useState } from "react";
import { LETTER_IMAGES, WORD_CARDS } from "../data/wordCards";

// Supabase 퍼블릭 스토리지 기본 URL
// 예: https://xxxx.supabase.co/storage/v1/object/public/word-images/default_en
const SUPABASE_BASE =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/word-images/default_en`;

/**
 * 단어 카드 이미지 URL 자동 생성 헬퍼
 * - letter: 'A' ~ 'Z'
 * - wordId: 'A_Airplane' 같은 id (WORD_CARDS 안에 들어 있는 값)
 */
function getWordImageUrl(letter, wordId) {
  if (!SUPABASE_BASE || !letter || !wordId) return "";
  return `${SUPABASE_BASE}/${letter}/${wordId}.png`;
}

/**
 * 알파벳 대표 카드 이미지 URL
 * - LETTER_IMAGES 에 이미 URL이 들어있다면 그대로 사용
 * - 나중에 Supabase로 옮기고 싶으면 위 헬퍼와 비슷하게 바꿀 수 있음
 */
function getLetterImageUrl(letter) {
  return LETTER_IMAGES[letter] || "";
}

export default function HomePage() {
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [selectedWords, setSelectedWords] = useState([]); // 오늘 동화에 꼭 넣을 단어들
  const [manualInput, setManualInput] = useState(""); // 직접 입력한 단어들
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 선택한 알파벳에 해당하는 단어 카드 목록
  const wordCardsForLetter = useMemo(() => {
    return WORD_CARDS[selectedLetter] || [];
  }, [selectedLetter]);

  // 단어 카드를 클릭했을 때 아래 입력창에 자동으로 추가
  const handleWordClick = (wordText) => {
    if (!wordText) return;

    // 이미 선택된 단어 칩 목록에 추가
    if (!selectedWords.includes(wordText)) {
      setSelectedWords((prev) => [...prev, wordText]);
    }

    // 아래 "오늘 배운 영어 단어 적기" 입력창에도 이어 붙이기
    setManualInput((prev) => {
      if (!prev.trim()) return wordText;
      return `${prev.replace(/[,\s]+$/, "")}, ${wordText}`;
    });
  };

  // 단어 칩(Word chip)을 클릭해서 제거
  const handleChipRemove = (wordText) => {
    setSelectedWords((prev) => prev.filter((w) => w !== wordText));
  };

  // 동화 만들기 버튼
  const handleMakeStory = async () => {
    const trimmedInput = manualInput.trim();

    if (!trimmedInput && selectedWords.length === 0) {
      setErrorMsg("먼저 오늘 배운 영어 단어를 하나 이상 입력해 주세요.");
      return;
    }

    setErrorMsg("");
    setStory("");

    setLoading(true);
    try {
      const allWords = [
        ...selectedWords,
        // 입력창에 있는 단어들을 , 기준으로 나눠서 정리
        ...trimmedInput
          .split(/[,，]/)
          .map((w) => w.trim())
          .filter(Boolean),
      ];

      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: allWords,
          idea: {
            character: "a child",
            place: "home or school",
            event: "something small but special happens",
            ending: "a warm, happy ending",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("AI 동화 생성 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.message || "동화를 만드는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF7EB",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "32px 16px 64px",
        }}
      >
        {/* 타이틀 */}
        <header style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#FF8A3C",
              marginBottom: 8,
            }}
          >
            MHJ STORYBOOK
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 8,
              color: "#2C1A10",
            }}
          >
            AI Storybook – 오늘 배운 단어로 영어 동화 만들기
          </h1>
          <p style={{ fontSize: 15, color: "#6B4E3D", lineHeight: 1.5 }}>
            아이와 함께 오늘 배운 영어 단어를 넣고, 3–7세 아이를 위한 아주 쉬운 영어
            동화를 만들어 보세요.
          </p>
        </header>

        {/* STEP 1 카드 영역 */}
        <section
          style={{
            backgroundColor: "#FFEBD2",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 12px 24px rgba(0,0,0,0.04)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: 999,
              backgroundColor: "#FFD1A3",
              fontSize: 12,
              fontWeight: 700,
              color: "#8A4B1D",
              marginBottom: 12,
            }}
          >
            STEP 1 · Today&apos;s words
          </div>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 4,
              color: "#3B2417",
            }}
          >
            오늘 배운 영어 단어 적기
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#7B5A45",
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나 줄바꿈으로
            구분하면 단어 칩이 자동으로 만들어집니다.
          </p>

          {/* 알파벳 선택 버튼 */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                color: "#4A2E1E",
              }}
            >
              알파벳 카드에서 단어 고르기:
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                const isActive = letter === selectedLetter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(letter)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 999,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                      color: isActive ? "#FFFFFF" : "#5B3A22",
                      backgroundColor: isActive ? "#FF8A3C" : "#FFF5E8",
                      boxShadow: isActive
                        ? "0 4px 10px rgba(0,0,0,0.18)"
                        : "0 2px 4px rgba(0,0,0,0.06)",
                      transition: "all 0.15s ease-out",
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 단어 카드 그리드 (3개 + 3개) */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginTop: 12,
              marginBottom: 8,
              color: "#4A2E1E",
            }}
          >
            &quot;{selectedLetter}&quot; 로 시작하는 단어 카드
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {wordCardsForLetter.map((word) => {
              const imgSrc = getWordImageUrl(selectedLetter, word.id);
              const alt = word.word || word.id;

              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleWordClick(word.word)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    textAlign: "center",
                    borderRadius: 24,
                    backgroundColor: "#FFF9F2",
                    padding: 12,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                    minHeight: 170,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "transform 0.12s ease-out, box-shadow 0.12s ease-out",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      borderRadius: 18,
                      overflow: "hidden",
                      backgroundColor: "#FFEFD9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={alt}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#B07C52",
                        }}
                      >
                        이미지 없음
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#4A2E1E",
                    }}
                  >
                    {word.word}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 오늘 배운 단어 입력창 */}
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 4,
                color: "#4A2E1E",
              }}
            >
              오늘 배운 영어 단어 적기
            </div>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              rows={4}
              placeholder="apple, banana 처럼 입력한 뒤 바깥을 클릭해 보세요."
              style={{
                width: "100%",
                borderRadius: 16,
                border: "1px solid #F3C8A2",
                padding: 12,
                fontSize: 14,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            {/* 단어 칩 영역 */}
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#85614B",
                  marginBottom: 4,
                }}
              >
                Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭
                들어갔으면 하는 단어로 표시됩니다.
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {selectedWords.length === 0 ? (
                  <span style={{ fontSize: 12, color: "#B38A6A" }}>
                    아직 입력된 단어가 없습니다.
                  </span>
                ) : (
                  selectedWords.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleChipRemove(w)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: "none",
                        backgroundColor: "#FFE0BF",
                        fontSize: 12,
                        color: "#5A341D",
                        cursor: "pointer",
                      }}
                    >
                      <span>★</span>
                      <span>{w}</span>
                      <span style={{ fontSize: 10 }}>×</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: 동화 결과 영역 (간단히 유지) */}
        <section
          style={{
            backgroundColor: "#FFF9F2",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 10px 20px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 12,
              color: "#3B2417",
            }}
          >
            STEP 2 · AI가 만든 영어 동화
          </h2>

          <button
            type="button"
            onClick={handleMakeStory}
            disabled={loading}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#FF8A3C",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "default" : "pointer",
              boxShadow: "0 6px 14px rgba(0,0,0,0.16)",
              marginBottom: 16,
            }}
          >
            {loading ? "동화를 만드는 중입니다..." : "AI에게 영어 동화 만들기 요청하기"}
          </button>

          {errorMsg && (
            <div
              style={{
                marginTop: 8,
                marginBottom: 8,
                padding: 10,
                borderRadius: 12,
                backgroundColor: "#FFF1F0",
                color: "#C0392B",
                fontSize: 13,
              }}
            >
              {errorMsg}
            </div>
          )}

          {story && (
            <div
              style={{
                marginTop: 12,
                padding: 16,
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                border: "1px solid #F1D5B8",
                whiteSpace: "pre-wrap",
                fontSize: 14,
                lineHeight: 1.6,
                color: "#3B2417",
              }}
            >
              {story}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
