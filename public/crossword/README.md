# Mini Crossword

A small, self-contained crossword UI built on top of
[crossword-layout-generator](https://www.npmjs.com/package/crossword-layout-generator)
([source](https://github.com/MichaelWehar/Crossword-Layout-Generator)).

## Run

Just open [index.html](index.html) in a browser — no build step, no install.
The layout library is loaded from a CDN.

If your browser blocks the CDN script, serve the folder locally:

```sh
cd crossword
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- Auto-generated layout from a list of `{ answer, clue }` pairs
- Click a cell or a clue to start typing; Space toggles Across/Down
- Arrow keys / Tab to navigate, Backspace to erase
- Buttons: **Check**, **Reveal letter**, **Reveal word**, **Clear**, **Solve**

## Customize words

Edit the `WORDS` array near the top of the `<script>` block in
[index.html](index.html#L172).
