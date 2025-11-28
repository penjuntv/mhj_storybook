// pages/index.js
import { useEffect, useMemo, useState } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WORDS = 8;

// id: "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" "); // "airplane", "X-mas", "Doll 2" etc.
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// 선택된 단어 배열을 텍스트로
function wordsToText(words) {
  return words.join(", ");
}

// 텍스트를 단어 배열로 (최대 8개, 중복 제거)
function textToWords(text) {
  if (!text) return [];
  const parts = text
    .split(/[,|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const unique = [];
  for (const p of parts) {
    const w = p;
    if (!unique.includes(w)) {
      unique.push(w);
      if (unique.length >= MAX_WORDS) break;
    }
  }
  return unique;
}

// Supabase public URL 생성 (이미지를 word-images/default_en/{letter}/{id}.png 형태로 올렸다고 가정)
function buildImageUrl(letter, id) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // id 예: "A_airplane"
  return `${baseUrl}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

export default function StorybookHome() {
  // STEP 1: 단어 카드/칩 관련 상태
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [selectedWords, setSelectedWords] = useState([]); // ["Apple", "Banana"]
  const [wordsText, setWordsText] = useState(""); // 텍스트 에디터 내용

  // STEP 2: 스토리 옵션
  const [placeInput, setPlaceInput] = useState("");
  const [eventInput, setEventInput] = useState("");
  const [endingInput, setEndingInput] = useState("");

  // 아이 프로필
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(""); // string으로 관리 (input value)
  const [narrationStyle, setNarrationStyle] = useState("I"); // "I" | "third"

  // 스토리 / 로딩 / 오류
  const [story, setStory] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [storyErrorMsg, setStoryErrorMsg] = useState("");

  // 장소/행동 아이디어 관련 상태
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasErrorMsg, setIdeasErrorMsg] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [actionSuggestions, setActionSuggestions] = useState([]);

  // 알파벳별 카드 목록
  const cardsForLetter = useMemo(() => {
    const list = WORD_CARDS[selectedLetter] || [];
    // id / imageUrl 구조여도 동작하고, imageUrl가 없다면 Supabase에서 생성
    return list.map((card) => {
      const word = idToWord(card.id);
      const imageUrl =
        card.imageUrl || buildImageUrl(selectedLetter, card.id); // 안전장치
      return { ...card, word, imageUrl };
    });
  }, [selectedLetter]);

  // selectedWords가 바뀔 때마다 textarea 내용을 동기화
  useEffect(() => {
    setWordsText(wordsToText(selectedWords));
  }, [selectedWords]);

  // 카드 클릭 → 단어 토글
  const handleCardClick = (word) => {
    setStoryErrorMsg("");
    setIdeasErrorMsg("");

    setSelectedWords((prev) => {
      const exists = prev.includes(word);
      if (exists) {
        // 이미 있으면 제거
        return prev.filter((w) => w !== word);
      }
      // 새로 추가
      if (prev.length >= MAX_WORDS) {
        return prev; // 최대 개수 초과 시 그대로
      }
      return [...prev, word];
    });
  };

  // textarea 직접 입력
  const handleWordsTextChange = (e) => {
    const text = e.target.value;
    setWordsText(text);
    const words = textToWords(text);
    setSelectedWords(words);
  };

  // 칩 클릭 시 제거
  const handleChipClick = (word) => {
    setStoryErrorMsg("");
    setIdeasErrorMsg("");
    setSelectedWords((prev) => prev.filter((w) => w !== word));
  };

  // STEP 2: 장소/행동 아이디어 요청
  const handleRequestStoryIdeas = async () => {
    setIdeasErrorMsg("");
    setPlaceSuggestions([]);
    setActionSuggestions([]);

    const wordsForStory = selectedWords;
    if (!Array.isArray(wordsForStory) || wordsForStory.length < 2) {
      setIdeasErrorMsg("단어를 최소 2개 이상 고른 뒤에 장소·행동 아이디어를 요청해 주세요.");
      return;
    }

    try {
      setIdeasLoading(true);
      const res = await fetch("/api/storyIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: wordsForStory }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to call /api/storyIdeas");
      }

      const data = await res.json();
      const places = Array.isArray(data.places) ? data.places : [];
      const actions = Array.isArray(data.actions) ? data.actions : [];

      setPlaceSuggestions(places);
      setActionSuggestions(actions);
    } catch (err) {
      console.error("Error in storyIdeas:", err);
      setIdeasErrorMsg("AI가 장소·행동 아이디어를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIdeasLoading(false);
    }
  };

  // STEP 2: AI에게 동화 만들기 요청
  const handleCreateStory = async () => {
    setStoryErrorMsg("");
    setStory("");
    setIdeasErrorMsg("");

    if (selectedWords.length < 2) {
      setStoryErrorMsg("먼저 단어 카드를 2개 이상 고르거나 오늘 배운 영어 단어를 적어 주세요.");
      return;
    }

    try {
      setIsStoryLoading(true);

      const body = {
        words: selectedWords,
        // 현재는 모든 단어를 mustInclude로 취급
        mustIncludeWords: selectedWords,
        idea: {
          characterName: childName || "",
          age: childAge || "",
          narrationStyle: narrationStyle === "I" ? "I" : "third",
          place: placeInput || "",
          event: eventInput || "",
          ending: endingInput || "",
        },
      };

      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "서버 오류가 발생했습니다.");
      }

      const data = await response.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setStoryErrorMsg(
        err.message || "AI 동화를 생성하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsStoryLoading(false);
    }
  };

  // ──────────────────────────────
  //  렌더링
  // ──────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 16px 80px",
        background: "#FFF6EC",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Noto Sans KR", system-ui, sans-serif',
        color: "#3A2A1A",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        {/* 헤더 영역 */}
        <header style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C58B4E",
              marginBottom: 8,
            }}
          >
            MHJ STORYBOOK
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            AI Storybook – 오늘 배운 단어로 영어 동화 만들기
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#654B34" }}>
            아이와 함께 오늘 배운 영어 단어를 넣고, 3–7세 아이를 위한 아주 쉬운 영어
            동화를 만들어 보세요.
          </p>
        </header>

        {/* STEP 1 카드 + 단어 입력 영역 */}
        <section
          style={{
            background: "#FDE9CF",
            borderRadius: 24,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 18px 45px rgba(219, 166, 114, 0.25)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "#F9CF90",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#7A4B16",
              marginBottom: 16,
            }}
          >
            STEP 1 · Today&apos;s words
          </div>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            오늘 배운 영어 단어 적기
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#7A5A3A",
              marginBottom: 16,
            }}
          >
            오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나 줄바꿈으로
            구분하면 단어 칩이 자동으로 만들어집니다.
          </p>

          {/* 알파벳 버튼 */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                color: "#7A5A3A",
              }}
            >
              알파벳 카드에서 단어 고르기:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALPHABETS.map((ch) => {
                const active = selectedLetter === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setSelectedLetter(ch)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: active ? "#FF9F4A" : "#FFFDF8",
                      color: active ? "#FFFFFF" : "#4A3523",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: active
                        ? "0 0 0 2px rgba(255,159,74,0.35)"
                        : "none",
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 알파벳별 단어 카드 3x2 그리드 */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 10,
                color: "#7A5A3A",
              }}
            >
              &quot;{selectedLetter}&quot; 로 시작하는 단어 카드
            </div>

            {cardsForLetter.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  borderRadius: 18,
                  background: "#FFF4E6",
                  fontSize: 14,
                  color: "#8A6A46",
                }}
              >
                이 알파벳에는 아직 카드가 없습니다.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 20,
                }}
              >
                {cardsForLetter.map((card) => {
                  const isSelected = selectedWords.includes(card.word);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleCardClick(card.word)}
                      style={{
                        border: "none",
                        padding: 0,
                        textAlign: "left",
                        cursor: "pointer",
                        background: "transparent",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 24,
                          background: "#FFFDF8",
                          boxShadow: isSelected
                            ? "0 0 0 2px #FF9F4A, 0 14px 30px rgba(0,0,0,0.08)"
                            : "0 14px 30px rgba(0,0,0,0.06)",
                          padding: 18,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 220,
                        }}
                      >
                        <div
                          style={{
                            width: 180,
                            height: 180,
                            borderRadius: 18,
                            background: "#FFF4E8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            marginBottom: 12,
                          }}
                        >
                          <img
                            src={card.imageUrl}
                            alt={card.word}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        </div>
                        {/* 카드 자체에 이미 단어 텍스트가 있으므로 아래 텍스트는 생략 가능.
                            필요하면 주석 해제:
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#3D2A1B",
                          }}
                        >
                          {card.word}
                        </div>
                        */}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 오늘 배운 영어 단어 적기 textarea */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 8,
                color: "#7A5A3A",
              }}
            >
              오늘 배운 영어 단어 적기
            </div>
            <textarea
              value={wordsText}
              onChange={handleWordsTextChange}
              placeholder="apple, banana, princess, ship 처럼 쉼표 또는 줄바꿈으로 구분해서 적어 주세요."
              rows={3}
              style={{
                width: "100%",
                borderRadius: 18,
                border: "1px solid rgba(0,0,0,0.08)",
                padding: 14,
                fontSize: 14,
                lineHeight: 1.6,
                resize: "vertical",
                background: "#FFFDF8",
              }}
            />
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "#8B6A49",
              }}
            >
              Word chips (단어 칩) · 단어 칩을 클릭하면 동화 속에 들어갈 단어를 삭제할
              수 있습니다. {selectedWords.length}/{MAX_WORDS}
            </div>
          </div>

          {/* 선택된 단어 칩 */}
          <div style={{ marginTop: 8 }}>
            {selectedWords.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: "#B1906A",
                }}
              >
                아직 입력된 단어가 없습니다. 카드나 텍스트로 단어를 추가해 보세요.
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedWords.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleChipClick(w)}
                    style={{
                      borderRadius: 999,
                      padding: "6px 12px",
                      border: "none",
                      background: "#FFEDD5",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#5E3B20",
                    }}
                  >
                    <span>★</span>
                    <span>{w}</span>
                    <span style={{ opacity: 0.65 }}>×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STEP 2: AI 동화 만들기 */}
        <section
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 18px 45px rgba(0,0,0,0.04)",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "#E3F2FF",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#255981",
              marginBottom: 16,
            }}
          >
            STEP 2 · AI가 만든 영어 동화
          </div>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            AI에게 영어 동화 만들기 요청하기
          </h2>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#6A4D33",
              marginBottom: 12,
            }}
          >
            아이가 고른 단어(2–8개)를 바탕으로 AI가 아주 쉬운 영어 동화를 만들어 줍니다.
            아래 옵션은 비워 둬도 괜찮고, 아이와 함께 간단히 적어 봐도 좋습니다.
          </p>

          {/* 아이 프로필 입력 */}
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 16,
              background: "#F5F8FF",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
                color: "#354869",
              }}
            >
              이야기를 들려줄 아이 정보
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#42526D",
                  }}
                >
                  이름 (예: Yujin)
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="아이 이름"
                  style={{
                    width: "100%",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.08)",
                    padding: "6px 10px",
                    fontSize: 13,
                    background: "#FFFFFF",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#42526D",
                  }}
                >
                  나이
                </label>
                <input
                  type="number"
                  min={3}
                  max={9}
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  placeholder="5"
                  style={{
                    width: "100%",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.08)",
                    padding: "6px 10px",
                    fontSize: 13,
                    background: "#FFFFFF",
                  }}
                />
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: 12,
                  marginRight: 8,
                  color: "#42526D",
                }}
              >
                이야기 방식
              </span>
              <button
                type="button"
                onClick={() => setNarrationStyle("I")}
                style={{
                  padding: "5px 10px",
                  borderRadius: 999,
                  border:
                    narrationStyle === "I"
                      ? "0"
                      : "1px solid rgba(0,0,0,0.12)",
                  background:
                    narrationStyle === "I" ? "#FF9F4A" : "#FFFFFF",
                  color: narrationStyle === "I" ? "#FFFFFF" : "#42526D",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginRight: 6,
                }}
              >
                아이가 &quot;나(I)&quot;로 이야기하기
              </button>
              <button
                type="button"
                onClick={() => setNarrationStyle("third")}
                style={{
                  padding: "5px 10px",
                  borderRadius: 999,
                  border:
                    narrationStyle === "third"
                      ? "0"
                      : "1px solid rgba(0,0,0,0.12)",
                  background:
                    narrationStyle === "third" ? "#FF9F4A" : "#FFFFFF",
                  color: narrationStyle === "third" ? "#FFFFFF" : "#42526D",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                아이 이야기를 밖에서 들려주기
              </button>
            </div>
          </div>

          {/* 장소/행동 아이디어 요청 버튼 */}
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={handleRequestStoryIdeas}
              disabled={ideasLoading}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "none",
                background: ideasLoading ? "#B0C4FF" : "#7DA4FF",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                cursor: ideasLoading ? "default" : "pointer",
                boxShadow: "0 10px 24px rgba(125,164,255,0.35)",
                marginRight: 8,
              }}
            >
              {ideasLoading
                ? "AI가 장소·행동을 고르는 중..."
                : "AI에게 장소·행동 아이디어 추천받기"}
            </button>
            <span
              style={{
                fontSize: 12,
                color: "#6A4D33",
              }}
            >
              (단어를 2개 이상 고른 뒤 눌러 주세요.)
            </span>
            {ideasErrorMsg && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "#C0392B",
                }}
              >
                {ideasErrorMsg}
              </div>
            )}
          </div>

          {/* 선택 옵션 (장소 / 무엇을 했나요 / 끝) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "#7A5A3A",
                }}
              >
                이야기 장소 (선택)
              </div>
              <input
                type="text"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
                placeholder="at the park, at home, on the beach..."
                style={{
                  width: "100%",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "8px 12px",
                  fontSize: 13,
                  background: "#FFFDF8",
                }}
              />
              {placeSuggestions.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: 4,
                      color: "#8B6A49",
                    }}
                  >
                    AI가 추천한 장소:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {placeSuggestions.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlaceInput(p)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: "none",
                          background: "#FFF4E6",
                          fontSize: 12,
                          cursor: "pointer",
                          color: "#6A4D33",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "#7A5A3A",
                }}
              >
                무엇을 했나요? (선택)
              </div>
              <input
                type="text"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="had a picnic, found a treasure..."
                style={{
                  width: "100%",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "8px 12px",
                  fontSize: 13,
                  background: "#FFFDF8",
                }}
              />
              {actionSuggestions.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: 4,
                      color: "#8B6A49",
                    }}
                  >
                    AI가 추천한 행동:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {actionSuggestions.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setEventInput(a)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: "none",
                          background: "#FFF4E6",
                          fontSize: 12,
                          cursor: "pointer",
                          color: "#6A4D33",
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "#7A5A3A",
                }}
              >
                어떻게 끝났으면 좋겠나요? (선택)
              </div>
              <input
                type="text"
                value={endingInput}
                onChange={(e) => setEndingInput(e.target.value)}
                placeholder="everyone smiles, they go to sleep..."
                style={{
                  width: "100%",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "8px 12px",
                  fontSize: 13,
                  background: "#FFFDF8",
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateStory}
            disabled={isStoryLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              background: isStoryLoading ? "#FFBF80" : "#FF9F4A",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 700,
              cursor: isStoryLoading ? "default" : "pointer",
              boxShadow: "0 12px 30px rgba(255,159,74,0.35)",
              marginBottom: 12,
            }}
          >
            {isStoryLoading
              ? "AI가 동화를 만드는 중..."
              : "AI에게 영어 동화 만들기 요청하기"}
          </button>

          {storyErrorMsg && (
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#C0392B",
                padding: "8px 12px",
                borderRadius: 12,
                background: "#FDECEA",
              }}
            >
              {storyErrorMsg}
            </div>
          )}

          {story && (
            <div
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 18,
                background: "#FFF9F0",
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {story}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
