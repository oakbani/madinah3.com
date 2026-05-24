---
mode: agent
description: Walk the user through turning a flashcard deck JSON into a YouTube video using playground/islamic/deck_to_video.py — pick a deck, confirm options (with defaults), render frames for review, then encode the video on approval.
---

# Deck → YouTube video (interactive)

Goal: produce a flashcard-style MP4 from one of the decks in `src/data/decks/` using `playground/islamic/deck_to_video.py`. Do this in two phases — render frames first, then encode the video only after the user has reviewed the frames.

Be concise. One question at a time. Confirm each answer is sane before moving on.

## Step 1 — Pick a deck

1. List every `*.json` file in `src/data/decks/` (use the file listing tools — do not guess).
2. Show the user the deck IDs (filenames without extension) as a numbered list and ask them to pick one. Accept either the number or the deck ID.
3. Resolve the absolute path to the chosen deck. Verify it exists.

## Step 2 — Collect options (one prompt with all defaults shown)

Ask the user to confirm or override these options. **Show each default**; user may press enter / say "defaults" to accept them all.

| Option | Default | Notes |
|---|---|---|
| `--language` | `en` | `en` or `ur` (only one, not both) |
| `--question-seconds` | `5` | Seconds the question slide is held |
| `--answer-seconds` | `7` | Seconds the answer slide is held |
| `--title-seconds` | `4` | Seconds the title slide is held |
| `--resolution` | `1080p` | `720p` / `1080p` / `1440p` / `2160p` / `WxH` |
| `--fps` | `30` | 30 is fine for static slides |
| `--output` | `playground/islamic/<deck-id>.mp4` | Final MP4 path |
| `--frames-dir` | `<output>.frames/` | Where preview PNGs go |
| `--music` | _(none)_ | Optional path to an mp3/wav/m4a; defer until Step 4 |
| `--music-volume` | `0.35` | 0.0–1.0; only relevant if music is set |

Tip: present the table, ask "Use all defaults? (Y/n / list overrides)". If they say yes, move on. If they list overrides, parse them and re-display the final config for confirmation.

## Step 3 — Render frames (always, first)

Run from the workspace root (the script expects deck paths relative to its own location, so cd into `playground/islamic` first):

```bash
cd playground/islamic && \
source venv/bin/activate 2>/dev/null; \
python deck_to_video.py \
  --deck <ABSOLUTE_OR_RELATIVE_DECK_PATH> \
  --output <OUTPUT> \
  --frames-dir <FRAMES_DIR> \
  --language <LANG> \
  --question-seconds <Q> \
  --answer-seconds <A> \
  --title-seconds <T> \
  --resolution <RES> \
  --fps <FPS> \
  --frames-only
```

Only include flags whose values differ from the script defaults — keep the command minimal. Print the resolved frames directory once the run completes.

Then **show one sample frame** (the title and one answer slide) inline using the image-view tool so the user can sanity-check the layout without opening a file manager.

## Step 4 — Ask for approval, then encode

Ask the user verbatim:

> "Do the frames look good? Reply **yes** to encode the video, **no** to abort, or describe a change to re-render."

- If **no / changes requested**: adjust options accordingly and loop back to Step 2 (only re-ask the options that need to change), then Step 3.
- If **yes**: now ask about background music *if they didn't already set it* **and narration is off**:
  > "Background music? Paste a path to an mp3/wav/m4a, or 'no' to skip."

  Skip this question entirely when `--narrate` is `edge` (or any non-`none` value) — narration replaces background music. Then run:

  ```bash
  cd playground/islamic && \
  source venv/bin/activate 2>/dev/null; \
  python deck_to_video.py \
    --deck <DECK> \
    --output <OUTPUT> \
    --frames-dir <FRAMES_DIR> \
    --from-frames \
    [--music <MUSIC> --music-volume <VOL>]
  ```

- When encoding finishes, print the absolute path to the generated MP4 and its size (`ls -lh <OUTPUT>`).

## Rules

- Never invent deck filenames — always list `src/data/decks/` first.
- Never proceed past Step 3 without explicit user approval.
- If the venv at `playground/islamic/venv/` doesn't exist, tell the user once and run `python` directly; do not try to create the venv.
- If ffmpeg is missing (encode step fails with that error), surface the install hint (`brew install ffmpeg`) and stop.
- Do not edit `deck_to_video.py` as part of this workflow. If a change is needed, surface it and ask first.
