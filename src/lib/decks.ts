// Auto-discover flashcard decks from src/data/decks/*.json.
// Each deck is fully self-contained: metadata + cards in one file.
//
// To add a new deck: drop a JSON file in `src/data/decks/`. It will be
// auto-picked up on the home page, get its own `/flashcards/<id>/` page,
// and added to the sitemap on next build. No code changes needed.

export type CardSide = { en?: string; ur?: string };
export type Card = { id?: string; front: CardSide; back: CardSide };

export type Deck = {
  /** URL-safe slug. Defaults to filename without extension. */
  id: string;
  /** Short title shown on cards and in the page heading. */
  title: string;
  /** One-line summary for the home grid + meta description. */
  description: string;
  /** Optional tags shown under the deck card. */
  tags?: string[];
  /** Optional bilingual title. Falls back to `title` if missing. */
  title_i18n?: { en?: string; ur?: string };
  /** The cards. */
  cards: Card[];
};

// Vite's import.meta.glob runs at build time and returns a static map of
// matching files. `eager: true` inlines the JSON; no runtime fetch needed.
const modules = import.meta.glob<{ default: Partial<Deck> }>(
  "../data/decks/*.json",
  { eager: true }
);

function slugFromPath(p: string): string {
  return p.split("/").pop()!.replace(/\.json$/, "");
}

export const decks: Deck[] = Object.entries(modules)
  .map(([filePath, mod]) => {
    const raw = mod.default;
    const id = (raw.id || slugFromPath(filePath)).trim();
    if (!raw.title) throw new Error(`Deck ${filePath} missing "title"`);
    if (!Array.isArray(raw.cards)) throw new Error(`Deck ${filePath} missing "cards" array`);
    return {
      id,
      title: raw.title,
      description: raw.description ?? "",
      tags: raw.tags ?? [],
      title_i18n: raw.title_i18n,
      cards: raw.cards as Card[],
    } satisfies Deck;
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getDeckById(id: string): Deck | undefined {
  return decks.find((d) => d.id === id);
}
