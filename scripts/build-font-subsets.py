"""Build local variable Chinese font subsets. Requires fonttools[woff] and brotli.

Usage: python scripts/build-font-subsets.py PATH_TO_OFFICIAL_FONTS
The directory must contain codex-serif.woff2 and codex-sans.woff2 downloaded
from Adobe's source-han-serif/source-han-sans release branches.
Rerun after adding Chinese content; unbundled characters use system fallback.
"""
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.ttLib import woff2

# Moderate compression avoids minutes of maximum-quality Brotli work per font.
original_compress = woff2.brotli.compress
woff2.brotli.compress = lambda data, **kwargs: original_compress(data, quality=5, **kwargs)

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
text = ''.join(chr(i) for i in range(32, 127))
for folder in (root / 'src', root / 'assets' / 'articles'):
    for file in folder.rglob('*'):
        if file.suffix in {'.js', '.css', '.md'}:
            text += file.read_text(encoding='utf-8')
text += (root / 'index.html').read_text(encoding='utf-8')
for kind in sys.argv[2:] or ('serif', 'sans'):
    print(f'{kind}: reading font', flush=True)
    font = TTFont(source / f'codex-{kind}.woff2')
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    job = subset.Subsetter(options=options)
    job.populate(text=text)
    print(f'{kind}: subsetting {len(set(text))} characters', flush=True)
    job.subset(font)
    # Subsetting creates a modified font; avoid the OFL reserved name "Source".
    for record in font['name'].names:
        if record.nameID in (1, 3, 4, 6, 16, 17, 21, 22, 25):
            name = record.toUnicode().replace('Source', 'Portfolio')
            font['name'].setName(name, record.nameID, record.platformID,
                                 record.platEncID, record.langID)
    font.flavor = 'woff2'
    output = root / 'assets' / 'fonts' / f'source-han-{kind}-sc.woff2'
    print(f'{kind}: compressing', flush=True)
    font.save(output)
    print(f'{kind}: {output.stat().st_size:,} bytes; {len(font.getBestCmap())} glyph mappings')
