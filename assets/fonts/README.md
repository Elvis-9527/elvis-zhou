# Chinese font assets

Card and button text follows the wordmark's Cormorant Garamond + Chinese serif
stack. General supporting text retains the Inter + Chinese sans stack.

The local variable fonts are subsets of Adobe Source Han Serif SC and Source
Han Sans SC, licensed under SIL OFL 1.1. Their license files are included here.
The subset font names replace the reserved name "Source" with "Portfolio".
CSS family aliases identify the source design.

Official upstream files:
- https://github.com/adobe-fonts/source-han-serif/blob/release/Variable/WOFF2/TTF/SourceHanSerifSC-VF.ttf.woff2
- https://github.com/adobe-fonts/source-han-sans/blob/release/Variable/WOFF2/TTF/SourceHanSansSC-VF.ttf.woff2

To refresh coverage after content changes, download these originals into an
external cache as `codex-serif.woff2` and `codex-sans.woff2`, install
`fonttools[woff]` and `brotli`, then run:

```sh
python scripts/build-font-subsets.py PATH_TO_CACHE
```

The script includes characters from the site's source, HTML and original
Markdown articles, preserves variable weights, and emits WOFF2 files here.
Characters outside that set fall back to the system fonts in `typography.css`.
