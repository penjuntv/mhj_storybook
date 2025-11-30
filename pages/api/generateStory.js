// pages/api/generateStory.js

/**
 * AI에게 동화를 생성해 달라고 요청하는 API 라우트
 * - 입력: childName, length("short"|"normal"|"long"), themeKey, words[]
 * - 출력: { story: string }
 */

const THEME_CONFIG = {
  everyday_adventure: {
    label: "일상 모험",
    styleHint:
      "집, 동네, 놀이터, 마트 같은 아주 평범한 공간에서 시작하지만, 작은 사건이 모험처럼 느껴지도록 만들어 주세요.",
  },
  school_story: {
    label: "학교 이야기",
    styleHint:
      "학교, 교실, 운동장, 급식실 등에서 벌어지는 에피소드로 구성하고, 선생님과 친구들이 자연스럽게 등장하도록 해 주세요.",
  },
  family: {
    label: "가족",
    styleHint:
      "엄마, 아빠, 형제자매(또는 보호자)와 함께 보내는 따뜻한 하루를 중심으로, 가족 사랑과 이해가 느껴지도록 해 주세요.",
  },
  friends: {
    label: "친구",
    styleHint:
      "친구와의 갈등, 오해, 화해, 협력이 중심이 되는 이야기로, 마지막에는 서로 더 친해지는 결말이 되게 해 주세요.",
  },
  animals: {
    label: "동물",
    styleHint:
      "강아지, 고양이, 토끼, 숲속 동물 등과 친구가 되거나 동물의 시점으로 이야기를 진행해 주세요. 동물이 말을 하거나 감정을 표현해도 좋습니다.",
  },
  princess: {
    label: "공주",
    styleHint:
      "성, 왕자, 마법, 무도회 같은 요소가 들어가는 디즈니·동화 느낌으로, 공주가 스스로 문제를 해결하는 주체적인 인물로 등장하도록 해 주세요.",
  },
  folktale: {
    label: "전래동화",
    styleHint:
      "“옛날 옛적에…”로 시작하는 한국/동아시아 전래동화 분위기로, 마을·산·강 같은 배경과 함께 마지막에 교훈이 느껴지는 결말을 넣어 주세요.",
  },
  space_sf: {
    label: "우주·SF",
    styleHint:
      "UFO, 우주선, 로봇, 외계 행성 등 SF 요소를 적극 활용해서, 아이가 우주를 여행하거나 외계 친구를 만나는 이야기로 만들어 주세요.",
  },
  hero: {
    label: "영웅",
    styleHint:
      "평범한 아이가 용기를 내어 누군가를 돕거나 작은 위기를 해결하면서, 자신의 장점을 발견하는 히어로 이야기로 만들어 주세요. 어두운 폭력·파괴 묘사는 피하고 유쾌하게 표현해 주세요.",
  },
};

function buildLengthHint(length) {
  switch (length) {
    case "short":
      // 그래도 최소 기승전결은 유지
      return "짧은 편이지만, 반드시 기-승-전-결이 느껴지도록 4단락 이상으로 써 주세요.";
    case "long":
      return "꽤 긴 분량으로, 각 장면을 조금 더 자세히 묘사하며 6~8단락 정도로 써 주세요.";
    case "normal":
    default:
      return "보통 길이로, 최소 5단락 정도의 분량으로 써 주세요.";
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const { childName, length, themeKey, words } = req.body || {};

    const safeChildName =
      typeof childName === "string" && childName.trim().length > 0
        ? childName.trim()
        : null;

    const lengthHint = buildLengthHint(length);
    const theme =
      THEME_CONFIG[themeKey] || THEME_CONFIG["everyday_adventure"];

    const wordList = Array.isArray(words)
      ? words
          .map((w) => {
            if (typeof w === "string") {
              return { word: w.trim(), mustInclude: false };
            }
            if (!w || !w.word) return null;
            return {
              word: String(w.word).trim(),
              mustInclude: Boolean(w.mustInclude),
            };
          })
          .filter((w) => w && w.word.length > 0)
      : [];

    const allWords = wordList.map((w) => w.word);
    const mustWords = wordList.filter((w) => w.mustInclude).map((w) => w.word);

    const wordsText =
      allWords.length === 0
        ? "이번 이야기에는 특별히 넣어야 할 영어 단어 목록이 없습니다."
        : `이번 이야기에서 사용할 영어 단어 목록은 다음과 같습니다: ${allWords.join(
            ", "
          )}.`;

    const mustText =
      mustWords.length === 0
        ? "꼭 들어가야 하는 필수 단어는 따로 없습니다."
        : `이 중에서 반드시 이야기 속에 등장해야 하는 필수 단어는 다음과 같습니다: ${mustWords.join(
            ", "
          )}.`;

    const childText = safeChildName
      ? `이야기의 주인공 이름은 "${safeChildName}"입니다. 이 이름이 자연스럽게 여러 번 등장하도록 해 주세요.`
      : "주인공 이름은 특별히 정해져 있지 않으므로, 한국 어린이에게 친숙한 이름 하나를 정해서 사용해 주세요.";

    const systemPrompt = `
당신은 7~10세 어린이를 위한 그림책 작가입니다.
아이들이 소리 내어 읽기 좋은, 부드럽고 리듬감 있는 한국어 문장을 잘 씁니다.
이야기는 항상 기-승-전-결 구조를 갖고, 충분한 분량과 장면 전환이 있으며,
아이들이 따라 말하기 좋은 간단한 영어 단어도 자연스럽게 포함합니다.
`.trim();

    const userPrompt = `
아래 정보를 반영해서 **어린이 영어 그림책 원고** 느낌의 이야기를 만들어 주세요.

1. 테마(강도 7/10로 크게 반영):
- 선택된 테마: ${theme.label}
- 테마 설명: ${theme.styleHint}
- 테마 강도는 7/10 정도로, 이야기의 분위기와 배경, 전개에 테마가 분명히 드러나야 하지만 너무 과장되지는 않게 해 주세요.

2. 주인공 정보:
- ${childText}

3. 영어 단어 목록:
- ${wordsText}
- ${mustText}
- 모든 영어 단어는 **철자를 정확하게 그대로** 사용해 주세요.
- 이야기 본문은 **한국어**로 쓰되, 위 영어 단어들이 자연스럽게 섞이도록 해 주세요.

4. 이야기 길이:
- ${lengthHint}

5. 형식 요구:
- 최소 4단락 이상, 가능하면 5~8단락 정도로 써 주세요.
- 각 단락은 줄바꿈(빈 줄)으로 구분해 주세요.
- **나레이션**과 **등장인물의 대사**가 섞여 있어야 합니다.
  - 대사는 큰따옴표(" ")를 사용해 표현해 주세요.
- 어린이에게 무섭거나 잔인한 내용, 현실적인 범죄·재난 묘사는 피하고,
  안전하고 희망적인 분위기를 유지해 주세요.
- 마지막에는 작은 교훈, 깨달음, 혹은 따뜻한 여운이 남도록 마무리해 주세요.
`.trim();

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.8,
          max_tokens: 1200,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return res.status(500).json({ error: "Failed to generate story" });
    }

    const data = await response.json();
    const story =
      data?.choices?.[0]?.message?.content?.trim() ||
      "AI가 동화를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";

    return res.status(200).json({ story });
  } catch (err) {
    console.error("generateStory handler error:", err);
    return res
      .status(500)
      .json({ error: "Unexpected error while generating story" });
  }
}
