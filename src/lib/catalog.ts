// Static catalog of puzzles and diagrams.
//
// NOTE: Flashcard decks have been moved to `src/data/decks/*.json` and are
// auto-discovered by `src/lib/decks.ts`. To add a deck, drop a JSON file in
// that directory — no edits here needed.

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

export type Article = {
  id: string;
  title: string;
  description: string;
  /** Path under /public/ to the article HTML. */
  href: string;
  tags?: string[];
};

export const articles: Article[] = [
  {
    id: "tawassul-after-wafat",
    title: "Can We Call upon the Prophet ﷺ After His Passing?",
    description: "What the Qurʾan, the hadith and the scholars of every generation say about calling upon the Prophet ﷺ after his passing.",
    href: "articles/tawassul-after-wafat/",
    tags: ["Aqidah", "Tawassul"],
  },
  {
    id: "feet-towards-qibla",
    title: "Feet Toward the Qibla: Is It a Sin?",
    description: "Disliked, but not a sin: what the Qurʾan, the hadith and the scholars say, and why we should be gentle with each other.",
    href: "articles/feet-towards-qibla/",
    tags: ["Fiqh", "Adab"],
  },
  {
    id: "mens-shorts-awrah",
    title: "How Short Is Too Short?",
    description: "What a man must cover, how long his shorts should be, and what the Qurʾan, the Sunnah and the scholars say.",
    href: "articles/mens-shorts-awrah/",
    tags: ["Fiqh", "Sitr al-ʿAwrah"],
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
