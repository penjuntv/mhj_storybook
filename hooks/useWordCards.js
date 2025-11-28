// hooks/useWordCards.js
// Supabase에서 알파벳별 단어 카드(이미지) 목록을 불러오는 커스텀 훅

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const BUCKET_NAME = "word-images";
const BASE_FOLDER = "default_en"; // word-images/default_en/<Letter>/...

export function useWordCards(selectedLetter) {
  const [cards, setCards] = useState([]); // { id, word, imageUrl }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const folderPath = `${BASE_FOLDER}/${selectedLetter}`;

        const { data, error: listError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(folderPath, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (listError) throw listError;

        if (!data) {
          if (!cancelled) setCards([]);
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

          // 파일명: A_airplane.png -> airplane -> Airplane
          let word = file.name;
          if (word.includes("_")) {
            const parts = word.split("_");
            parts.shift();
            word = parts.join("_");
          }
          word = word.replace(/\.[^/.]+$/, "");
          if (word.length > 0) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }

          return {
            id: fullPath,
            word,
            imageUrl: publicUrlData?.publicUrl || "",
          };
        });

        if (!cancelled) setCards(mapped);
      } catch (err) {
        console.error("useWordCards: failed to load cards", err);
        if (!cancelled) {
          setError("카드를 불러오는 중 문제가 발생했습니다.");
          setCards([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedLetter]);

  return { cards, isLoading, error };
}
