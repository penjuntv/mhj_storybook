// components/storybook/Step2Story.js
// STEP 2: 아이 프로필 + 이야기 방식 + 테마 + 길이 선택
// 순수 프레젠테이션 컴포넌트 (상태와 요청 로직은 pages/index.js에서 처리)

function toArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export default function Step2Story(props) {
  const {
    kidName,
    onChangeKidName,
    pov,
    onChangePov,
    themes,
    onToggleTheme,
    length,
    onChangeLength,
    texts = {},
  } = props;

  const {
    nameLabel = "이름 (예: Yujin)",
    wayLabel = "이야기 방식",
    wayFirst = "내가 이야기의 주인공 (1인칭)",
    wayThird = "내가 들려주는 이야기 (3인칭)",
    themeLabel = "이야기 테마 고르기",
    lengthLabel = "이야기 길이 선택",
    lengthShort = "짧게",
    lengthNormal = "보통",
    lengthLong = "길게",
  } = texts || {};

  const safeThemes = toArray(themes);

  return (
    <div className="step2-story">
      {/* 이름 입력 */}
      <div className="step2-row">
        <label className="input-label">{nameLabel}</label>
        <input
          type="text"
          className="text-input"
          value={kidName}
          onChange={(e) => onChangeKidName?.(e.target.value)}
          placeholder="예: yujin"
        />
      </div>

      {/* 이야기 방식 */}
      <div className="step2-row">
        <label className="input-label">{wayLabel}</label>
        <div className="button-group">
          <button
            type="button"
            className={`pill-button ${pov === "first" ? "active" : ""}`}
            onClick={() => onChangePov?.("first")}
          >
            {wayFirst}
          </button>
          <button
            type="button"
            className={`pill-button ${pov === "third" ? "active" : ""}`}
            onClick={() => onChangePov?.("third")}
          >
            {wayThird}
          </button>
        </div>
      </div>

      {/* 테마 선택 */}
      <div className="step2-row">
        <label className="input-label">{themeLabel}</label>
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
                onClick={() => onToggleTheme?.(theme.id)}
              >
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 길이 선택 */}
      <div className="step2-row">
        <label className="input-label">{lengthLabel}</label>
        <div className="button-group">
          <button
            type="button"
            className={`pill-button ${length === "short" ? "active" : ""}`}
            onClick={() => onChangeLength?.("short")}
          >
            {lengthShort}
          </button>
          <button
            type="button"
            className={`pill-button ${length === "normal" ? "active" : ""}`}
            onClick={() => onChangeLength?.("normal")}
          >
            {lengthNormal}
          </button>
          <button
            type="button"
            className={`pill-button ${length === "long" ? "active" : ""}`}
            onClick={() => onChangeLength?.("long")}
          >
            {lengthLong}
          </button>
        </div>
      </div>
    </div>
  );
}
