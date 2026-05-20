---
title: "How this site is built"
description: "A quick tour of Astro, content collections, and where the data lives."
date: 2026-05-19
lang: en
tags: ["astro", "meta"]
---

This site is built with **Astro**, deployed to GitHub Pages from this repo.

## File layout

```
src/
  pages/        ← becomes URLs (file-based routing)
  layouts/      ← shared HTML shells
  content/blog/ ← Markdown posts (this file is one of them)
  lib/          ← TypeScript helpers
public/         ← static assets served as-is (existing HTML apps live here)
```

## How a Markdown post becomes a page

1. You drop `src/content/blog/hello.md` with frontmatter.
2. `src/content/config.ts` validates the frontmatter shape.
3. `src/pages/blog/[...slug].astro` builds one HTML page per entry.
4. `astro build` writes static HTML into `dist/`.

No server. No database. Just files.

## Why content collections?

Because Astro **type-checks the frontmatter**. Forget the `date`? Build fails. Misspell a tag's type? Build fails. You don't catch it on a Tuesday at 3am.
