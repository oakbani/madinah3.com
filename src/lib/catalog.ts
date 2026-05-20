// Static catalog of available decks and puzzles. Adding content = adding an
// entry here + dropping the JSON/HTML in /public.
//
// Paths are relative to import.meta.env.BASE_URL so the site works under
// the GitHub Pages subpath (/automation-3/).

export type Deck = {
  id: string;
  title: string;
  description: string;
  /** Path under /public/ to the deck JSON file. */
  json: string;
  /** Optional tags for filtering / display. */
  tags?: string[];
};

export type Puzzle = {
  id: string;
  title: string;
  description: string;
  /** Path under /public/ to the puzzle HTML. */
  href: string;
  kind: "crossword" | "wordsearch";
  language?: "en" | "ur";
};

export type Diagram = {
  id: string;
  title: string;
  description: string;
  /** Path under /public/ to the diagram JSON. */
  json: string;
  kind: "flowchart" | "tree" | "mindmap";
};

export const decks: Deck[] = [
  {
    id: "urdu-vocab",
    title: "Urdu vocabulary",
    description: "Everyday Urdu words with English meanings. Tap a card to flip.",
    json: "flashcards/cards.json",
    tags: ["urdu", "vocabulary"],
  },
];

export const puzzles: Puzzle[] = [
  {
    id: "crossword-en",
    title: "Mini Crossword",
    description: "Programming-themed crossword. Type letters; use Tab and Space to navigate.",
    href: "crossword/index.html",
    kind: "crossword",
    language: "en",
  },
  {
    id: "wordsearch-en",
    title: "Word Search — English",
    description: "Drag across letters to circle each hidden word. Clues only — no spoilers.",
    href: "crossword/wordsearch.html",
    kind: "wordsearch",
    language: "en",
  },
  {
    id: "wordsearch-ur",
    title: "Word Search — اردو",
    description: "Urdu word search with English clues. Single-codepoint letters per cell.",
    href: "crossword/wordsearch-urdu.html",
    kind: "wordsearch",
    language: "ur",
  },
];

export const diagrams: Diagram[] = [
  {
    id: "flowchart-static-site",
    title: "How a request reaches a static site",
    description: "Browser → DNS → CDN → assets. Flowchart with a decision branch.",
    json: "diagrams/flowchart-static-site.json",
    kind: "flowchart",
  },
  {
    id: "tree-js-types",
    title: "JavaScript data types",
    description: "Primitive vs. reference types — laid out as a tree.",
    json: "diagrams/tree-js-types.json",
    kind: "tree",
  },
  {
    id: "mindmap-webapp",
    title: "Building a web app",
    description: "Frontend, backend, infra — as a mindmap.",
    json: "diagrams/mindmap-webapp.json",
    kind: "mindmap",
  },
];
