# The Ultimate Rational Meme — Conjecture Con Europe 2026

A 10-minute talk by Paul Razvan Berg (PRB) at Conjecture Con Europe 2026.

Built with [Slidev](https://sli.dev/) using the repository's pinned dependency.

## Run

```bash
bun install --frozen-lockfile
bun run slidev slides/cce-2026/slides.md
```

Run these commands from the repository root and visit <http://localhost:3030>. Use `just dev` to
develop the complete site.

## Deploy

```bash
bun run build:slides  # rebuild the Slidev decks
just build            # build the complete site into dist/
```

Push to `main` to publish through GitHub Pages.

## Assets

Slide images live in `public/img/` and are referenced from the slides with deck-relative paths (e.g.
`src="img/urm-tree.svg"`). Vite copies everything under `public/` to the deck root at build time, so
a file at `public/img/foo.png` is served from `<deck-base>/img/foo.png`.

Keep `public/Draft Paper.pdf` here so deck rebuilds preserve
`/presentations/cce-2026/Draft%20Paper.pdf`.
