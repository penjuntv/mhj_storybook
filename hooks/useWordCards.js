// hooks/useWordCards.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const BUCKET_NAME = "word-images";
const BASE_FOLDER = "default_en"; // word-images/default_en/<Letter>/... 구조라고 가정

export function useWordCards(selectedLetter) {
  const [cards, setCards] = useState([]); // [{ id, word, imageUrl }]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadCards() {
      setIsLoading(true);
      setError("");
      try {
        const folderPath = `${BASE_FOLDER}/${selectedLetter}`;

        const { data, error: listError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(folderPath, {
            limit: 50,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (listError) throw listError;
        if (!data) {
          if (!isCancelled) setCards([]);
          return;
        }

        const imageFiles = data.filter((file) =>
          file.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/)
        );

        const mapped = imageFiles.map((file) => {
          const fullPath = `${folderPath}/${file.name}`;
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fullPath);

          // 파일명에서 단어 추출: A_airplane.png -> Airplane
          let word = file.name;
          if (word.includes("_")) {
            const parts = word.split("_");
            parts.shift(); // 앞의 알파벳 제거
            word = parts.join("_");
          }
          word = word.replace(/\.[^/.]+$/, ""); // 확장자 제거
          if (word.length > 0) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }

          return {
            id: fullPath,
            word,
            imageUrl: publicUrlData?.publicUrl || "",
          };
        });

        if (!isCancelled) {
          setCards(mapped);
        }
      } catch (err) {
        console.error("Supabase list error:", err);
        if (!isCancelled) {
          setError("카드를 불러오는 중 문제가 발생했습니다.");
          setCards([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadCards();

    return () => {
      isCancelled = true;
    };
  }, [selectedLetter]);

  return { cards, isLoading, error };
}
