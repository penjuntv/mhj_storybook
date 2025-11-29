// components/storybook/Step1Words.js
import { useState } from "react";
import { useWordCards } from "../../hooks/useWordCards";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WORDS = 8;

export default function Step1Words({
  t,
  selectedLetter,
  onChangeLetter,
  selectedWords,
  onChangeSelectedWords,
}) {
  const [wordInput, setWordInput] = useState("");
  const { cards, isLoading, error } = useWordCards(selectedLetter);

  const selectedCount = selectedWords.length;

  const addWordToChips = (rawWord) => {
    const word = (rawWord || "").trim();
    if (!word) return;

    onChangeSelectedWords((prev) => {
      if (prev.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      if (prev.length >= MAX_WORDS) return prev;
      return [...prev, { word, mustInclude: false }];
    });
  };

  const removeWordFromChips = (wordToRemove) => {
    onChangeSelectedWords((prev) =>
      prev.filter(
        (w) => w.word.toLowerCase() !== wordToRemove.toLowerCase()
      )
    );
  };

  const toggleMustInclude = (wordToToggle) => {
    onChangeSelectedWords((prev) =>
      prev.map((w) =>
        w.word.toLowerCase() === wordToToggle.toLowerCase()
          ? { ...w, mustInclude: !w.mustInclude }
          : w
      )
    );
  };

  const processWordInput = () => {
    const tokens = wordInput
      .split(/[,;\n]/)
      .map((w) => w.trim())
      .filter(Boolean);

    tokens.forEach(addWordToChips);
  };

  const handleWordInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processWordInput();
    }
  };

  const handleWordInputBlur = () => {
    processWordInput();
  };

  const styles = {
    stepBox: {
      background: "#FFE3C1",
      borderRadius: 20,
      padding: "24px 24px 28px",
      marginBottom: 24,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 8,
    },
    stepSubtitle: {
      fontSize: 13,
      marginBottom: 16,
      lineHeight: 1.4,
    },
    alphabetRowOuter: {
      marginBottom: 12,
    },
    alphabetRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 6,
      justifyContent: "center",
    },
    alphabetButton: (active) => ({
      width: 46,
      height: 46,
      borderRadius: 999,
      border: "0",
      background: active ? "#FF8C41" : "#FFF8F0",
      color: active ? "#fff" : "#7a4c25",
      boxShadow: active ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 16,
    }),
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
      gap: 24,
      marginTop: 18,
      marginBottom: 20,
    },
    card: {
      background: "#FEE7C9",
      borderRadius: 30,
      padding: 18,
      boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 260,
    },
    cardImageWrapper: {
      width: "100%",
      maxWidth: 320,
      borderRadius: 24,
      background: "#FFEFD9",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain", // 이미지 잘리지 않게
      display: "block",
    },
    textarea: {
      width: "100%",
      minHeight: 90,
      borderRadius: 16,
      border: "2px solid #f5c08c",
      padding: "10px 12px",
      fontSize: 14,
      resize: "vertical",
      outline: "none",
      boxSizing: "border-box",
      background: "#FFF9F3",
      marginBottom: 12,
    },
    chipsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    chip: (mustInclude) => ({
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 999,
      background: "#FFF9F3",
      border: mustInclude ? "1px solid #FF8C41" : "1px solid #F2C199",
      fontSize: 13,
      cursor: "pointer",
      boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
    }),
    chipStar: (mustInclude) => ({
      color: mustInclude ? "#FF8C41" : "#d0a17a",
      marginRight: 4,
      fontSize: 13,
    }),
    chipRemove: {
      marginLeft: 6,
      fontSize: 13,
      cursor: "pointer",
      opacity: 0.7,
    },
  };

  const firstRow = LETTERS.slice(0, 13);
  const secondRow = LETTERS.slice(13);

  return (
    <section style={styles.stepBox}>
      <div style={styles.stepTitle}>{t.step1Title}</div>
      <div style={styles.stepSubtitle}>{t.step1Subtitle}</div>

      <div style={{ fontSize: 13, marginBottom: 6 }}>{t.pickFromCards}</div>

      {/* 알파벳 버튼 13 + 13 */}
      <div style={styles.alphabetRowOuter}>
        <div style={styles.alphabetRow}>
          {firstRow.map((letter) => (
            <button
              key={letter}
              type="button"
              style={styles.alphabetButton(letter === selectedLetter)}
              onClick={() => onChangeLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div style={styles.alphabetRow}>
          {secondRow.map((letter) => (
            <button
              key={letter}
              type="button"
              style={styles.alphabetButton(letter === selectedLetter)}
              onClick={() => onChangeLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 그리드 */}
      {isLoading ? (
        <div style={{ fontSize: 13, margin: "8px 0 12px" }}>
          카드 이미지를 불러오는 중입니다…
        </div>
      ) : error ? (
        <div style={{ fontSize: 13, margin: "8px 0 12px", color: "#D23B3B" }}>
          {error}
        </div>
      ) : cards.length === 0 ? (
        <div style={{ fontSize: 13, margin: "8px 0 12px" }}>
          {t.noCardsForLetter.replace("{letter}", selectedLetter)}
        </div>
      ) : (
        <div style={styles.cardsGrid}>
          {cards.map((card) => (
            <button
              type="button"
              key={card.id}
              style={styles.card}
              onClick={() => addWordToChips(card.word)}
            >
              <div style={styles.cardImageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.imageUrl}
                  alt={card.word}
                  style={styles.cardImage}
                />
              </div>
              {/* 아래 텍스트는 제거 – 이미지 안에 이미 단어가 들어가 있음 */}
            </button>
          ))}
        </div>
      )}

      {/* 오늘 배운 단어 입력 */}
      <div
        style={{
          marginTop: 8,
          marginBottom: 4,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {t.writeWordsLabel}
      </div>
      <textarea
        style={styles.textarea}
        placeholder={t.writeWordsPlaceholder}
        value={wordInput}
        onChange={(e) => setWordInput(e.target.value)}
        onKeyDown={handleWordInputKeyDown}
        onBlur={handleWordInputBlur}
      />

      <div style={{ fontSize: 13 }}>
        {t.chipsLabel}
        {selectedCount}
        {t.countSuffix}
      </div>

      {selectedCount === 0 ? (
        <div style={{ fontSize: 13, marginTop: 6 }}>{t.selectedZero}</div>
      ) : (
        <div style={styles.chipsRow}>
          {selectedWords.map((item) => (
            <div
              key={item.word}
              style={styles.chip(item.mustInclude)}
              onClick={() => toggleMustInclude(item.word)}
            >
              <span style={styles.chipStar(item.mustInclude)}>★</span>
              <span>{item.word}</span>
              <span
                style={styles.chipRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  removeWordFromChips(item.word);
                }}
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
