// components/storybook/Step2Story.js
// STEP 2: 아이 프로필 + 이야기 방식 + 테마 + 길이 선택 & 동화 생성 버튼

function toArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export default function Step2Story(props) {
  const {
    language,
    t,
    selectedWords,

    kidName,
    setKidName,
    pov,
    setPov,
    themeId,
    setThemeId,
    length,
    setLength,

    isRequesting,
    setIsRequesting,
    storyError,
    setStoryError,

    onStoryGenerated,
  } = props;

  const safeSelectedWords = Array.isArray(selectedWords)
    ? selectedWords
    : [];

  const safeThemes = toArray(themeId);

  const handleToggleTheme = (id) => {
    setThemeId((prev) => {
      const arr = toArray(prev);
      const exists = arr.includes(id);
      if (exists) {
        return arr.filter((x) => x !== id);
      }
      return [...arr, id];
    });
  };

  const handleRequestStory = async () => {
    setStoryError(null);

    const coreWords = safeSelectedWords
      .map((w) => (typeof w === "string" ? w : w.word))
      .filter(Boolean);

    if (coreWords.length < 2) {
      setStoryError("단어를 최소 2개 이상 선택해 주세요.");
      return;
    }

    setIsRequesting(true);
    try {
      // 1) 우선 간단한 로컬 스토리 생성 (항상 동작 보장)
      const displayName =
        (kidName || "").trim() || t.defaultChildName || "my friend";

      const povLabel =
        pov === "third" ? t.povThird || "3인칭" : t.povFirst || "1인칭";

      const lengthLabel =
        length === "short"
          ? t.lengthShort || "아주 짧게"
          : length === "long"
          ? t.lengthLong || "조금 길게"
          : t.lengthNormal || "보통 길이";

      const themesText =
        safeThemes.length > 0
          ? safeThemes.join(", ")
          : t.themeEveryday || "일상 모험";

      const wordsText = coreWords.join(", ");

      const localStory = [
        `${displayName}를 위한 ${povLabel} ${t.storyTitleSuffix || "영어 동화"}입니다.`,
        "",
        `${displayName}가 좋아하는 말들은 ${wordsText} 입니다.`,
        `이야기의 분위기는 ${themesText}이고, 길이는 ${lengthLabel} 정도로 구성했습니다.`,
        "",
        `${displayName}는 오늘 ${themesText} 속에서 특별한 모험을 떠납니다...`,
      ].join("\n");

      // 2) onStoryGenerated로 결과 전달
      if (typeof onStoryGenerated === "function") {
        onStoryGenerated(localStory);
      }
    } catch (err) {
      console.error(err);
      setStoryError("동화를 만드는 중 문제가 생겼습니다.");
    } finally {
      setIsRequesting(false);
    }
  };

  // 버튼/텍스트는 t에 없으면 한글 기본값 사용
  const labelName = t.step2NameLabel || "이름 (예: Yujin)";
  const labelPov = t.step2PovLabel || "이야기 방식";
  const labelTheme = t.step2ThemeLabel || "이야기 테마 고르기";
  const labelLength = t.step2LengthLabel || "이야기 길이";
  const buttonRequest =
    t.step2RequestButton || "AI에게 영어 동화 만들기 요청하기";

  return (
    <div className="step2-story">
      <h2 className="section-title">{t.step2Title}</h2>
      <p className="section-desc">{t.step2Description}</p>

      {/* 이름 입력 */}
      <div className="step2-row">
        <label className="input-label">{labelName}</label>
        <input
          type="text"
          className="text-input"
          value={kidName}
          onChange={(e) => setKidName(e.target.value)}
          placeholder="예: yujin"
        />
      </div>

      {/* 이야기 방식 */}
      <div className="step2-row">
        <label className="input-label">{labelPov}</label>
        <div className="button-group">
          <button
            type="button"
            className={`pill-button ${pov === "first" ? "active" : ""}`}
            onClick={() => setPov("first")}
          >
            내가 이야기의 주인공 (1인칭)
          </button>
          <button
            type="button"
            className={`pill-button ${pov === "third" ? "active" : ""}`}
            onClick={() => setPov("third")}
          >
            내가 들려주는 이야기 (3인칭)
          </button>
        </div>
      </div>

      {/* 테마 선택 */}
      <div className="step2-row">
        <label className="input-label">{labelTheme}</label>
        <div className="button-group theme-group">
          {[
            { id: "everyday", label: "🏠 일상 모험" },
            { id: "school", label: "🏫 학교 이야기" },
            { id: "family", label: "👪 가족" },
            { id: "friends", label: "🧑‍🤝‍🧑 친구" },
            { id: "animals", label: "🐶 동물" },
            { id: "princess", label: "👑 공주" },
            { id: "hero", label: "🧑‍🚒 영웅" },
            { id: "fairytale", label: "📜 전래동화" },
            { id: "animation", label: "🎬 애니메이션 느낌" },
            { id: "space", label: "🚀 우주 / SF" },
          ].map((theme) => {
            const active = safeThemes.includes(theme.id);
            return (
              <button
                key={theme.id}
                type="button"
                className={`pill-button ${active ? "active" : ""}`}
                onClick={() => handleToggleTheme(theme.id)}
              >
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 길이 선택 */}
      <div className="step2-row">
        <label className="input-label">{labelLength}</label>
        <div className="button-group">
          <button
            type="button"
            className={`pill-button ${length === "short" ? "active" : ""}`}
            onClick={() => setLength("short")}
          >
            숏 (아주 짧게)
          </button>
          <button
            type="button"
            className={`pill-button ${length === "normal" ? "active" : ""}`}
            onClick={() => setLength("normal")}
          >
            노멀 (보통 길이)
          </button>
          <button
            type="button"
            className={`pill-button ${length === "long" ? "active" : ""}`}
            onClick={() => setLength("long")}
          >
            롱 (조금 길게)
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {storyError && (
        <p className="error-text">
          {storyError}
        </p>
      )}

      {/* 요청 버튼 */}
      <div className="step2-row">
        <button
          type="button"
          className="primary-button"
          onClick={handleRequestStory}
          disabled={isRequesting}
        >
          {isRequesting ? "AI가 동화를 만드는 중…" : buttonRequest}
        </button>
      </div>
    </div>
  );
}
