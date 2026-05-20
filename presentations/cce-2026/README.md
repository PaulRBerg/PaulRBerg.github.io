# The Ultimate Rational Meme — Conjecture Con Europe 2026

A 10-minute talk by Paul Razvan Berg (PRB) at Conjecture Con Europe 2026.

Built with [Slidev](https://sli.dev/) (latest).

## Run

```bash
bun install   # or pnpm / npm
bun run dev
```

Visit <http://localhost:3030>.

## Deploy

```bash
bun run build      # → dist/
bun run deploy     # → Vercel (needs .env with VERCEL_TOKEN)
```

## Assets

Slide images live in `public/img/` and are referenced from the slides with deck-relative paths (e.g. `src="img/urm-tree.svg"`). Vite copies everything under `public/` to the deck root at build time, so a file at `public/img/foo.png` is served from `<deck-base>/img/foo.png`.
