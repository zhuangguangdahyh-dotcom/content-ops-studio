# Render determinism and fonts

Determinism means the same structured input in the same OS/architecture, Chromium version and resolved-font profile produces the same DOM, compiler hashes, measurements, dimensions and PNG SHA-256. It is not a promise of a universal macOS/Linux/Windows pixel hash.

The context freezes viewport, scale, locale, timezone, color scheme, reduced motion, network, animation, caret, dynamic time and randomness. Rendering waits for `document.fonts.ready` and two animation frames. Chromium DevTools platform-font evidence records the actual family used for the title, body and page number without storing font files or paths.

Readable fallback may be reported with a warning. No usable Chinese font is blocking. Fonts are not downloaded, bundled, copied or shared.
