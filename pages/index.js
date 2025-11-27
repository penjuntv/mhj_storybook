// pages/index.js
import { useState, useCallback } from "react";
import { LETTER_IMAGES, WORD_CARDS } from "../data/wordCards";

const MAX_WORDS = 8;
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// id가 "A_Airplane" 형태일 때 두 번째 토큰을 단어로 사용
function getWordFromCard(card) {
  if (card.word) return card.word;
  if (!card.id) return "";
  const parts = String(card.id).split("_");
  return parts[1] || parts[0] || "";
}

export default function HomePage() {
  const [selectedLetter, setSelectedLetter] = useState("A");

  // chips로 관리하는 "오늘의 핵심 단어들"
  const [selectedWords, setSelectedWords] = useState([]);

  // 위 입력창(쉼표/엔터로 단어 추가)
  const [wordsInput, setWordsInput] = useState("");

  // STEP 2 입력
  const [placeInput, setPlaceInput] = useState("at the park");
  const [actionInput, setActionInput] = useState("picnic");
  const [endingInput, setEndingInput] = useState("happy");

  // 결과/에러/로딩
  const [story, setStory] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentCards = WORD_CARDS[selectedLetter] || [];

  // chip 추가 유틸 (중복/공백/최대 개수 체크)
  const addWords = useCallback((words) => {
    setSelectedWords((prev) => {
      const next = [...prev];
      for (const raw of words) {
        const word = raw.trim();
        if (!word) continue;
        if (next.includes(word)) continue;
        if (next.length >= MAX_WORDS) break;
        next.push(word);
      }
      return next;
    });
  }, []);

  // 카드 클릭 시 단어 추가
  const handleCardClick = (card) => {
    const word = getWordFromCard(card);
    if (!word) return;
    addWords([word]);
  };

  // 입력창에서 쉼표/엔터/blur 시 단어 commit
  const commitInputToWords = () => {
    if (!wordsInput.trim()) return;
    const tokens = wordsInput
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length === 0) return;
    addWords(tokens);
    setWordsInput(""); // commit 후 입력창 비우기
  };

  const handleWordsKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      commitInputToWords();
    }
  };

  const handleWordsBlur = () => {
    commitInputToWords();
  };

  const handleRemoveWord = (word) => {
    setSelectedWords((prev) => prev.filter((w) => w !== word));
  };

  // AI 동화 생성
  const handleCreateStory = async () => {
    setErrorMsg("");
    setStory("");

    if (selectedWords.length < 2) {
      setErrorMsg("단어는 최소 2개 이상 선택해 주세요.");
      return;
    }
    if (selectedWords.length > MAX_WORDS) {
      setErrorMsg(`단어는 최대 ${MAX_WORDS}개까지만 사용할 수 있습니다.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: selectedWords,
          place: placeInput,
          action: actionInput,
          ending: endingInput,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "AI 동화 생성 요청 실패");
      }

      const data = await response.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setErrorMsg("AI 동화 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6EC] text-[#4A3422]">
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            AI Storybook – 오늘 배운 단어로 영어 동화 만들기
          </h1>
          <p className="text-sm md:text-base text-[#6C543C]">
            아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한 아주 쉬운
            영어 동화를 만들어 보세요.
          </p>
        </header>

        {/* STEP 1 */}
        <section className="bg-[#FDE8CC] rounded-3xl p-6 md:p-8 shadow-md mb-10">
          <div className="inline-block px-4 py-1 rounded-full bg-white/70 text-xs font-semibold text-[#B37543] mb-4">
            STEP 1 · Today&apos;s words
          </div>

          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            오늘 배운 영어 단어 적기
          </h2>
          <p className="text-sm md:text-base text-[#6C543C] mb-4">
            오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉽표(,)나
            줄바꿈으로 구분하면 단어 칩이 자동으로 만들어집니다.
          </p>

          {/* 알파벳 선택 */}
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">
              알파벳 카드에서 단어 고르기:
            </p>
            <div className="flex flex-wrap gap-2">
              {ALPHABETS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold border ${
                    selectedLetter === letter
                      ? "bg-[#FFB26B] text-white border-[#FFB26B]"
                      : "bg-white text-[#4A3422] border-[#E3C7A1]"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* 현재 알파벳 카드 그리드 (3 x 2) */}
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">
              &quot;{selectedLetter}&quot; 로 시작하는 단어 카드
            </p>
            {currentCards.length === 0 ? (
              <div className="text-sm text-[#8A7257]">
                이 알파벳에는 아직 카드가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentCards.map((card) => {
                  const word = getWordFromCard(card);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleCardClick(card)}
                      className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-between px-4 pt-4 pb-3"
                    >
                      <div className="w-full aspect-square flex items-center justify-center mb-3">
                        {card.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={card.imageUrl}
                            alt={word}
                            className="w-full h-full object-contain rounded-2xl"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-2xl bg-[#FFF4E3] text-xs text-[#B7A089]">
                            이미지 없음
                          </div>
                        )}
                      </div>
                      <div className="text-sm md:text-base font-semibold text-[#4A3422]">
                        {word}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 오늘 배운 영어 단어 입력 */}
          <div className="mt-8">
            <p className="text-sm font-semibold mb-2">
              오늘 배운 영어 단어 적기
            </p>
            <textarea
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              onKeyDown={handleWordsKeyDown}
              onBlur={handleWordsBlur}
              rows={3}
              className="w-full rounded-2xl border border-[#E3C7A1] px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#FFB26B] focus:border-[#FFB26B] bg-white"
              placeholder="apple, banana 처럼 쉽표(,)나 줄바꿈으로 단어를 적어 주세요."
            />
            <p className="mt-2 text-xs md:text-sm text-[#8A7257]">
              Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에
              꼭 들어갔으면 하는 단어로 표시됩니다. {selectedWords.length}/
              {MAX_WORDS}
            </p>

            {/* Word chips */}
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedWords.length === 0 ? (
                <div className="text-xs md:text-sm text-[#B7A089]">
                  아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해
                  보세요.
                </div>
              ) : (
                selectedWords.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleRemoveWord(word)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-xs md:text-sm font-medium text-[#4A3422]"
                  >
                    <span className="text-[#FFB26B]">★</span>
                    <span>{word}</span>
                    <span className="text-[#C3A489] text-xs">×</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        {/* STEP 2 – AI 동화 만들기 */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-md mb-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            STEP 2 · AI에게 영어 동화 만들기 요청하기
          </h2>
          <p className="text-sm md:text-base text-[#6C543C] mb-6">
            아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를
            만들어 줍니다. 아래 옵션은 비워 둬도 괜찮고, 아이와 함께 간단히
            적어 봐도 좋습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold mb-1">이야기 장소 (선택)</p>
              <input
                type="text"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
                className="w-full rounded-2xl border border-[#E3C7A1] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FFB26B] focus:border-[#FFB26B] bg-[#FFF9F2]"
                placeholder="at the park, at home, at school..."
              />
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">무엇을 했나요? (선택)</p>
              <input
                type="text"
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                className="w-full rounded-2xl border border-[#E3C7A1] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FFB26B] focus:border-[#FFB26B] bg-[#FFF9F2]"
                placeholder="picnic, party, adventure..."
              />
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">
                어떻게 끝났으면 좋겠나요? (선택)
              </p>
              <input
                type="text"
                value={endingInput}
                onChange={(e) => setEndingInput(e.target.value)}
                className="w-full rounded-2xl border border-[#E3C7A1] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FFB26B] focus:border-[#FFB26B] bg-[#FFF9F2]"
                placeholder="happy, funny, surprising..."
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateStory}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FF9F5A] hover:bg-[#FF8A33] text-white text-sm md:text-base font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "AI가 동화를 만드는 중..." : "AI에게 영어 동화 만들기 요청하기"}
          </button>

          {errorMsg && (
            <p className="mt-3 text-sm text-red-600 whitespace-pre-line">
              {errorMsg}
            </p>
          )}

          {story && (
            <div className="mt-6 border-t border-[#F1D5B0] pt-4">
              <h3 className="text-lg font-semibold mb-2">AI가 만든 영어 동화</h3>
              <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">
                {story}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
