// Auto-discover word search puzzles from src/data/wordsearches/*.json.
// Each puzzle is fully self-contained: metadata + words in one file.
//
// To add a new puzzle: drop a JSON file in `src/data/wordsearches/`. It will
// get its own `/wordsearches/<id>/` page and be added to the sitemap on next
// build. No code changes needed.

export type WordEntry = { answer: string; clue?: string };

export type WordSearch = {
  /** URL-safe slug. Defaults to filename without extension. */
  id: string;
  /** Short title shown on cards and in the page heading. */
  title: string;
  /** One-line summary for the home grid + meta description. */
  description: string;
  /** Display language code (only "en" supported for now). */
  language?: "en";
  /** Optional age range hint (e.g. "6-12"). */
  ageRange?: string;
  /** Optional tags shown under the puzzle card. */
  tags?: string[];
  /** The words to find. */
  words: WordEntry[];
};

const modules = import.meta.glob<{ default: Partial<WordSearch> }>(
  "../data/wordsearches/*.json",
  { eager: true }
);

function slugFromPath(p: string): string {
  return p.split("/").pop()!.replace(/\.json$/, "");
}

export const wordsearches: WordSearch[] = Object.entries(modules)
  .map(([filePath, mod]) => {
    const raw = mod.default;
    const id = (raw.id || slugFromPath(filePath)).trim();
    if (!raw.title) throw new Error(`Word search ${filePath} missing "title"`);
    if (!Array.isArray(raw.words) || raw.words.length === 0) {
      throw new Error(`Word search ${filePath} missing "words" array`);
    }
    return {
      id,
      title: raw.title,
      description: raw.description ?? "",
      language: raw.language ?? "en",
      ageRange: raw.ageRange,
      tags: raw.tags ?? [],
      words: raw.words as WordEntry[],
    } satisfies WordSearch;
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getWordSearchById(id: string): WordSearch | undefined {
  return wordsearches.find((w) => w.id === id);
}
