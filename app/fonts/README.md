The unmodified Inter Latin variable WOFF2 is the same Google Fonts asset previously
self-hosted by `next/font/google` (SHA-256 can be compared with the baseline build).
Source: https://fonts.google.com/specimen/Inter and https://github.com/rsms/inter.
License: [SIL Open Font License 1.1](OFL.txt).

`next/font/local` declares the storefront's used weight range, 400–700, and emits
one immutable asset with one preload and Arial fallback metrics. A single
variable file avoids separate downloads for regular, medium, semibold and bold.
It is not claimed that declaring this range removes axes from the binary.

Latin Extended and other language subsets are intentionally not registered.
Characters outside this Latin font (notably the Ghana cedi symbol, U+20B5) use
the platform font fallback. This avoids downloading 85 KB for that symbol.
