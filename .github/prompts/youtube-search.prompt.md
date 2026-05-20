---
description: "Search YouTube videos by keywords, filter by duration, deduplicate similar titles, and produce a WhatsApp-ready list. Use when: searching islamic videos, mufti videos, youtube search, qurbani clips, whatsapp video list."
name: "YouTube Video Search"
argument-hint: "Describe the topic you want to search (e.g. mufti akmal qurbani clips under 5 min)"
agent: "agent"
---

You are helping the user search YouTube for videos and produce a clean, shareable WhatsApp message.

Follow these steps exactly:

## Step 1 — Gather inputs

Ask the user these three questions (all at once, in one message):

1. **Must-have keywords** — phrase(s) that MUST appear in every result (will be quoted, e.g. `"mufti akmal"`). Can be left blank.
2. **OR keywords** — one or more words where at least one must appear (joined with `|`, e.g. `qurbani|qasai|janwar`). Can be left blank.
3. **Max duration** — maximum video length in minutes (e.g. `5`).

Optionally also ask:
4. **Max results per keyword** — how many videos to fetch per query (default `50`, max `200`).

## Step 2 — Build the search query

Combine the inputs into a single `q` parameter string:
- If must-have phrase provided: wrap in double quotes → `"mufti akmal"`
- If OR keywords provided: join with `|` → `qurbani|qasai`
- Combine with a space: `"mufti akmal" qurbani|qasai`
- If only one side is provided, use just that part.

## Step 3 — Run the script

Run the search script from the workspace root:

```bash
cd /Users/owais.akbani/Documents/automation-3
source islamic/venv/bin/activate && python3 islamic/search_youtube.py \
  --keywords '<QUERY>' \
  --max-duration <MAX_DURATION> \
  --max-results <MAX_RESULTS> \
  --output islamic/youtube_results_$(date +%Y%m%d_%H%M%S).json
```

Replace `<QUERY>`, `<MAX_DURATION>`, and `<MAX_RESULTS>` with the values from Step 1.
The output JSON file will be saved directly into `islamic/`.

## Step 4 — Deduplicate and group

Read the output JSON. For each video:
- **Drop** videos where the title does not appear to be closely related to the search intent (off-topic results that slipped through).
- **Deduplicate**: if two or more titles are very similar in meaning (same ruling, same question phrased differently), keep only the one with the highest `view_count`.
- **Group** the remaining videos by topic/theme (e.g. Obligation, Animal Eligibility, Slaughter Method, Meat Distribution, etc.).

## Step 5 — Produce WhatsApp output

Format the final deduplicated list as a WhatsApp message using this exact style:

```
🕌 *<Topic> — Videos*
_(<N> clips, grouped by topic)_

━━━━━━━━━━━━━━━━━━
📌 *GROUP NAME*
━━━━━━━━━━━━━━━━━━
1. Refined readable title (no hashtags, no channel name)
https://youtu.be/<video_id>

2. ...
```

Rules for titles:
- Remove `#shorts`, `#bayan`, channel names, and hashtag noise from titles
- Translate or simplify where helpful (keep Urdu-Roman as-is if that's the language)
- Keep titles concise — one clear question or topic per entry

## Step 6 — Save output

Save the WhatsApp message to a `.txt` file in the `islamic/` folder named after the topic, e.g. `islamic/muftiakmal-qurbani.txt`.

Tell the user the filename and how many videos are in the final list.
