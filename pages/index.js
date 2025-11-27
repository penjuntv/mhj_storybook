// pages/index.js
import { useState, useMemo } from "react";

// Supabase Storage에 올려 둔 이미지 경로 헬퍼
// 예: bucket: word-images / default_en/A/A_Airplane.png
const SUPABASE_PUBLIC_URL =
  "https://wnwpyhdrjtjgcfvlwxin.supabase.co/storage/v1/object/public/word-images";

function getWordImageUrl(letter, word) {
  // Airplane -> A_Airplane.png 형식
  const cleanWord = word.replace(/\s+/g, "");
  return `${SUPABASE_PUBLIC_URL}/default_en/${letter}/${letter}_${cleanWord}.png`;
}

// 알파벳 순서
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// 알파벳별 단어 목록 (이미지 & 텍스트용)
// 필요하면 여기서 단어를 추가/수정하면 됨. (나중에 Supabase DB로 옮기기 쉬운 구조)
const WORD_DATA = {
  A: ["Airplane", "Alligator", "Angry", "Ant", "Apple", "Astronaut"],
  B: ["Baby", "Ball", "Banana", "Bear", "Bed", "Bus"],
  C: ["Cake", "Car", "Cat", "Chair", "Chicken", "Cloud"],
  D: ["Dad", "Dinosaur", "Dog", "Doll", "Door", "Duck"],
  E: ["Eagle", "Ear", "Egg", "Elephant", "Engine", "Eye"],
  F: ["Family", "Farm", "Finger", "Fire", "Fish", "Flower"],
  G: ["Game", "Ghost", "Gift", "Giraffe", "Grape", "Guitar"],
  H: ["Hair", "Hand", "Hat", "Hero", "House", "Hug"],
  I: ["Icecream", "Igloo", "Ink", "Insect", "Island", "Invite"],
  J: ["Jacket", "Jam", "Jar", "Jeep", "Jellyfish", "Juice"],
  K: ["Kangaroo", "Key", "Kick", "King", "Kite", "Kitten"],
  L: ["Ladybug", "Leaf", "Lemon", "Lion", "Lunch", "Lamp"],
  M: ["Milk", "Monkey", "Moon", "Mountain", "Mouse", "Music"],
  N: ["Nail", "Nest", "Net", "Nose", "Nurse", "Nut"],
  O: ["Ocean", "Octopus", "Office", "Oil", "Onion", "Orange"],
  P: ["Panda", "Pants", "Party", "Pen", "Pig", "Pizza"],
  Q: ["Queen", "Question", "Quiet", "Quilt", "Quiz", "Quick"],
  R: ["Rabbit", "Rain", "Rainbow", "Ring", "Robot", "Rose"],
  S: ["Salt", "Sand", "School", "Sea", "Socks", "Sun"],
  T: ["Table", "Tail", "Tea", "Teacher", "Tiger", "Train"],
  U: ["Umbrella", "Uncle", "Under", "Uniform", "Unicorn", "Up"],
  V: ["Vacuum", "Van", "Vegetable", "Vest", "Violin", "Village"],
  W: ["Wall", "Watch", "Water", "Whale", "Window", "Wolf"],
  X: ["Xray", "Xylophone", "Box", "Fox", "Mix", "Six"],
  Y: ["Yacht", "Yak", "Yellow", "Yogurt", "Young", "YoYo"],
  Z: ["Puzzle", "Zebra", "Zero", "Zigzag", "Zipper", "Zoo"],
};

const MAX_WORDS = 8;

export default function HomePage() {
  // 선택된 알파벳
  const [selectedLetter, setSelectedLetter] = useState("A");

  // 오늘의 핵심 단어들 (칩)
  const [selectedWords, setSelectedWords] = useState([]);

  // 입력창에 보여줄 문자열 (쉼표로 구분된 단어들)
  const [wordInput, setWordInput] = useState("");

  // STEP 2 입력값
  const [place, setPlace] = useState("");
  const [action, setAction] = useState("");
  const [ending, setEnding] = useState("");

  // 스토리 결과 및 에러
  const [story, setStory] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 현재 알파벳의 단어들
  const currentWords = useMemo(
    () => WORD_DATA[selectedLetter] || [],
    [selectedLetter]
  );

  // 공통: 단어 추가 로직 (중복/8개 제한 처리)
  const addWord = (word) => {
    const clean = word.trim();
    if (!clean) return;

    setSelectedWords((prev) => {
      if (prev.includes(clean)) return prev;
      if (prev.length >= MAX_WORDS) return prev;
      return [...prev, clean];
    });
  };

  // 공통: 여러 개 단어 한꺼번에 추가 (쉼표로 분리된 경우 등)
  const addWordsFromString = (text) => {
    const parts = text
      .split(/[,，\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (parts.length === 0) return;

    setSelectedWords((prev) => {
      let next = [...prev];
      for (const p of parts) {
        if (next.length >= MAX_WORDS) break;
        if (!next.includes(p)) {
          next.push(p);
        }
      }
      return next;
    });
  };

  // 1) 카드 클릭 → 단어 추가
  const handleCardClick = (word) => {
    addWord(word);
  };

  // 2) 입력창 변화
  const handleWordInputChange = (e) => {
    setWordInput(e.target.value);
  };

  // 3) 입력창에서 엔터/쉼표 입력 시 단어 반영
  const handleWordInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Process") {
      e.preventDefault();
      if (!wordInput.trim()) return;
      addWordsFromString(wordInput);
      setWordInput("");
    }
  };

  // 4) 입력창 포커스 아웃 시 남은 텍스트도 단어로 처리
  const handleWordInputBlur = () => {
    if (!wordInput.trim()) return;
    addWordsFromString(wordInput);
    setWordInput("");
  };

  // 5) 칩 삭제
  const handleChipRemove = (word) => {
    setSelectedWords((prev) => prev.filter((w) => w !== word));
  };

  // 6) Story API 호출
  const handleStoryRequest = async () => {
    setErrorMsg("");
    setStory("");

    const coreWords = selectedWords;
    if (coreWords.length < 2) {
      setErrorMsg("단어는 최소 2개 이상 골라 주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: coreWords,
          place: place || "",
          action: action || "",
          ending: ending || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "AI 동화 생성에 실패했습니다.");
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "AI 동화 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #fff7ec, #fffaf3)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        color: "#3c2a1d",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px 60px",
        }}
      >
        {/* 헤더 */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#f28c3a",
                textTransform: "uppercase",
              }}
            >
              MHJ STORYBOOK
            </div>
            <h1
              style={{
                marginTop: "8px",
                fontSize: "28px",
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              AI Storybook – 오늘 배운 단어로 영어 동화 만들기
            </h1>
            <p
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#7a5b3a",
              }}
            >
              아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한 아주 쉬운
              영어 동화를 만들어 보세요.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid #e0c9a7",
                cursor: "default",
              }}
            >
              EN
            </span>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid #f28c3a",
                backgroundColor: "#f28c3a",
                color: "white",
                cursor: "default",
              }}
            >
              KO
            </span>
          </div>
        </header>

        {/* STEP 1 카드 영역 */}
        <section
          style={{
            backgroundColor: "#fee9cfa6",
            borderRadius: "28px",
            padding: "28px 26px 30px",
            boxShadow: "0 18px 30px rgba(0,0,0,0.04)",
            border: "1px solid #f5d8b2",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: "#fce0b8",
              fontSize: "12px",
              fontWeight: 700,
              color: "#a76523",
              marginBottom: "16px",
            }}
          >
            STEP 1 · Today&apos;s words
          </div>

          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              marginBottom: "6px",
            }}
          >
            오늘 배운 영어 단어 적기
          </h2>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "16px",
              color: "#7a5b3a",
            }}
          >
            오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나
            줄바꿈으로 구분하면 단어 칩이 자동으로 만들어집니다.
          </p>

          {/* 알파벳 버튼 */}
          <div
            style={{
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            알파벳 카드에서 단어 고르기:
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            {ALPHABETS.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "999px",
                  border:
                    selectedLetter === letter
                      ? "2px solid #f28c3a"
                      : "1px solid #e0c9a7",
                  backgroundColor:
                    selectedLetter === letter ? "#ffe1c4" : "#fff7ec",
                  color: "#4a321f",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {letter}
              </button>
            ))}
          </div>

          <div
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            &quot;{selectedLetter}&quot; 로 시작하는 단어 카드
          </div>

          {/* 단어 카드 그리드 (3 x 2) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "22px",
            }}
          >
            {currentWords.map((word) => (
              <button
                key={word}
                onClick={() => handleCardClick(word)}
                style={{
                  borderRadius: "26px",
                  padding: "14px 12px 12px",
                  backgroundColor: "#fffdf8",
                  border: "1px solid #f2d9b8",
                  boxShadow:
                    "0 14px 24px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.6)",
                  cursor: selectedWords.includes(word)
                    ? "default"
                    : "pointer",
                  transform: selectedWords.includes(word)
                    ? "translateY(0)"
                    : "translateY(0)",
                  transition: "box-shadow 0.15s ease, transform 0.15s ease",
                }}
              >
                <div
                  style={{
                    borderRadius: "22px",
                    backgroundColor: "#fff4dc",
                    padding: "12px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 150,
                  }}
                >
                  <img
                    src={getWordImageUrl(selectedLetter, word)}
                    alt={word}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "18px",
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#3c2a1d",
                  }}
                >
                  {word}
                </div>
              </button>
            ))}
          </div>

          {/* 오늘 배운 단어 입력창 */}
          <div
            style={{
              marginTop: "4px",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            오늘 배운 영어 단어 적기
          </div>
          <textarea
            placeholder="apple, banana 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요."
            value={wordInput}
            onChange={handleWordInputChange}
            onKeyDown={handleWordInputKeyDown}
            onBlur={handleWordInputBlur}
            rows={3}
            style={{
              width: "100%",
              borderRadius: "18px",
              border: "1px solid #f0cda7",
              padding: "10px 12px",
              fontSize: "15px",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          {/* Word chips */}
          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              color: "#7a5b3a",
              marginBottom: "6px",
            }}
          >
            Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭
            들어갔으면 하는 단어로 표시됩니다. {selectedWords.length}/
            {MAX_WORDS}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              minHeight: 40,
              padding: selectedWords.length ? "6px 0 0" : "0",
            }}
          >
            {selectedWords.length === 0 ? (
              <div style={{ fontSize: "13px", color: "#b28a5a" }}>
                아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해
                보세요.
              </div>
            ) : (
              selectedWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleChipRemove(word)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px 6px 10px",
                    borderRadius: "999px",
                    border: "none",
                    backgroundColor: "#fff7ec",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#f28c3a" }}>★</span>
                  <span>{word}</span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#b28a5a",
                      marginLeft: 4,
                    }}
                  >
                    ×
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        {/* STEP 2: AI에게 동화 만들기 요청하기 */}
        <section
          style={{
            marginTop: "26px",
            backgroundColor: "#fffdf9",
            borderRadius: "26px",
            padding: "24px 24px 28px",
            border: "1px solid #f1dec5",
            boxShadow: "0 16px 26px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              marginBottom: "10px",
            }}
          >
            STEP 2 · AI에게 영어 동화 만들기 요청하기
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#7a5b3a",
              marginBottom: "18px",
            }}
          >
            아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를
            만들어 줍니다. 아래 옵션은 비워 둬도 괜찮고, 아이와 함께 간단히
            적어 봐도 좋습니다.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                이야기 장소 (선택)
              </div>
              <input
                type="text"
                placeholder="at the park, at home, at school..."
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "999px",
                  border: "1px solid #f0cda7",
                  padding: "8px 12px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                무엇을 했나요? (선택)
              </div>
              <input
                type="text"
                placeholder="picnic, birthday party, reading a book..."
                value={action}
                onChange={(e) => setAction(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "999px",
                  border: "1px solid #f0cda7",
                  padding: "8px 12px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                어떻게 끝났으면 좋겠나요? (선택)
              </div>
              <input
                type="text"
                placeholder="happy, funny, surprising..."
                value={ending}
                onChange={(e) => setEnding(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "999px",
                  border: "1px solid #f0cda7",
                  padding: "8px 12px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleStoryRequest}
            disabled={isLoading}
            style={{
              marginTop: "4px",
              padding: "12px 26px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: isLoading ? "#e0a26a" : "#f28c3a",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              cursor: isLoading ? "default" : "pointer",
              boxShadow: "0 10px 18px rgba(0,0,0,0.15)",
            }}
          >
            {isLoading ? "AI가 동화를 만드는 중..." : "AI에게 영어 동화 만들기 요청하기"}
          </button>

          {/* 에러/스토리 출력 */}
          {errorMsg && (
            <div
              style={{
                marginTop: "14px",
                padding: "10px 12px",
                borderRadius: "12px",
                backgroundColor: "#fff1f1",
                color: "#b04141",
                fontSize: "14px",
              }}
            >
              {errorMsg}
            </div>
          )}

          {story && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px 16px 14px",
                borderRadius: "16px",
                backgroundColor: "#fffdf8",
                border: "1px solid #f0dec8",
                fontSize: "15px",
                lineHeight: 1.6,
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
