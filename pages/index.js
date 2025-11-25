// pages/index.js
import { useState } from "react";

export default function Home() {
  const [wordsInput, setWordsInput] = useState("");
  const [words, setWords] = useState([]);
  const [mustUse, setMustUse] = useState([]);
  const [answers, setAnswers] = useState({
    mainCharacter: "",
    place: "",
    problem: "",
    ending: "",
  });
  const [length, setLength] = useState("normal"); // "short" | "normal" | "long"
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // STEP 1: 오늘 배운 단어 입력 → 칩으로 분리
  const handleWordsBlur = () => {
    const parts = wordsInput
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    setWords(parts);
    // 기존 mustUse 중에 없는 단어는 자동 제거
    setMustUse((prev) => prev.filter((w) => parts.includes(w)));
  };

  const toggleMustUse = (word) => {
    setMustUse((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // STEP 2: 폼 입력
  const handleAnswerChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleLengthChange = (value) => {
    setLength(value);
  };

  // STEP 3: 스토리 생성
  const handleCreateStory = async () => {
    setErrorMsg("");
    setStory("");

    const trimmedWords = words.map((w) => w.trim()).filter(Boolean);

    if (trimmedWords.length === 0) {
      setErrorMsg("먼저 오늘 배운 영어 단어를 입력해 주세요.");
      return;
    }

    if (!answers.mainCharacter || !answers.place || !answers.problem) {
      setErrorMsg("STEP 2의 질문 1~3번은 꼭 채워 주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: trimmedWords,
          mustUse,
          answers,
          length,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "스토리 생성에 실패했습니다.");
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <main className="app-card">
        {/* 헤더 */}
        <header className="app-header">
          <span className="app-tag">MHJ Storybook</span>
          <h1 className="app-title">
            AI Storybook – 오늘 배운 단어로 영어 동화 만들기
          </h1>
          <p className="app-sub">
            아이가 오늘 배운 영어 단어와 상상력을 말해 주면, 아주 쉬운 영어
            그림책 텍스트를 자동으로 만들어 주는 작은 도구입니다.
          </p>
        </header>

        {/* STEP 1 */}
        <section className="step-card">
          <span className="step-label">STEP 1 · Today&apos;s words</span>
          <h2 className="step-title">오늘 배운 영어 단어 적기</h2>
          <p className="step-desc">
            오늘 수업/숙제/책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나 줄바꿈으로
            구분하면 자동으로 단어 칩이 만들어집니다.
          </p>

          <label className="field-label">
            오늘 배운 영어 단어들
            <textarea
              className="textarea"
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              onBlur={handleWordsBlur}
              placeholder={"예) apple, banana, cat, dog"}
            />
          </label>

          <div className="chips-help">
            Word chips{" "}
            <span className="chips-help-sub">
              (단어 칩을 클릭하면 “꼭 들어가야 하는 단어 ★”로 표시됩니다.)
            </span>
          </div>
          <div className="chips-note">
            STEP 2에서 만든 동화 줄거리 안에, ★ 표시한 단어는 반드시 포함해 달라고
            AI에게 부탁합니다.
          </div>

          <div className="chips-row">
            {words.map((w) => {
              const isMust = mustUse.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleMustUse(w)}
                  className={
                    "chip" + (isMust ? " chip-selected" : "")
                  }
                >
                  {isMust && <span className="chip-star">★</span>}
                  <span>{w}</span>
                </button>
              );
            })}
            {words.length === 0 && (
              <span className="chips-empty">
                아직 단어가 없습니다. 위 입력창에 단어를 적고 바깥을 클릭해 보세요.
              </span>
            )}
          </div>
        </section>

        {/* STEP 2 */}
        <section className="step-card">
          <span className="step-label">STEP 2 · Story idea</span>
          <h2 className="step-title">아이와 함께 줄거리 만들기</h2>
          <p className="step-desc">
            아이에게 한국어로 질문하고, 부모가 간단한 영어 문장으로 대신 적어 줘도
            됩니다. 완벽한 문장이 아니어도 괜찮습니다.
          </p>

          <label className="field-label">
            1) Who is the main character?
          </label>
          <input
            type="text"
            className="input"
            value={answers.mainCharacter}
            onChange={(e) =>
              handleAnswerChange("mainCharacter", e.target.value)
            }
            placeholder="예) Yujin, a brave girl"
          />

          <label className="field-label">
            2) Where does the story happen?
          </label>
          <input
            type="text"
            className="input"
            value={answers.place}
            onChange={(e) => handleAnswerChange("place", e.target.value)}
            placeholder="예) in the yard with a cat and a dog"
          />

          <label className="field-label">
            3) What happens? (problem or event)
          </label>
          <input
            type="text"
            className="input"
            value={answers.problem}
            onChange={(e) => handleAnswerChange("problem", e.target.value)}
            placeholder="예) they play basketball together"
          />

          <label className="field-label">
            4) How do you want the story to end?
          </label>
          <input
            type="text"
            className="input"
            value={answers.ending}
            onChange={(e) => handleAnswerChange("ending", e.target.value)}
            placeholder="예) everyone is happy and still friends"
          />

          {/* 길이 선택 + 버튼 */}
          <div className="button-row">
            <span style={{ fontSize: 13 }}>Story length:</span>
            <button
              type="button"
              className={
                "btn ghost" + (length === "short" ? " chip-selected" : "")
              }
              onClick={() => handleLengthChange("short")}
            >
              Short
            </button>
            <button
              type="button"
              className={
                "btn ghost" + (length === "normal" ? " chip-selected" : "")
              }
              onClick={() => handleLengthChange("normal")}
            >
              Normal
            </button>
            <button
              type="button"
              className={
                "btn ghost" + (length === "long" ? " chip-selected" : "")
              }
              onClick={() => handleLengthChange("long")}
            >
              Long
            </button>

            <button
              type="button"
              className="btn primary"
              onClick={handleCreateStory}
              disabled={loading}
            >
              {loading ? "Creating story..." : "Create story"}
            </button>
          </div>

          {errorMsg && <div className="error-msg">{errorMsg}</div>}
        </section>

        {/* STEP 3 */}
        <section className="step-card">
          <span className="step-label">STEP 3 · Result</span>
          <h2 className="step-title">AI가 만든 우리 아이 전용 동화</h2>
          {!story && !loading && (
            <p className="placeholder">
              위 단계를 채운 뒤 &quot;Create story&quot; 버튼을 누르면, 여기 아주
              쉬운 영어 동화가 나타납니다.
            </p>
          )}
          {story && (
            <div className="story-box">
              <div className="story-tag">Generated story</div>
              <p className="story-text">{story}</p>
            </div>
          )}
        </section>

        {/* Admin / 메모 영역 (선택) */}
        <section className="admin-section">
          <h3 className="admin-title">Admin note</h3>
          <p className="admin-text">
            이 페이지는 /api/story 엔드포인트 하나만 사용하는 간단한 Next.js
            프로젝트입니다. 나중에 Framer, Figma, 다른 앱에서 이 API만 따로
            연결해서 써도 됩니다.
          </p>
        </section>
      </main>
    </div>
  );
}
