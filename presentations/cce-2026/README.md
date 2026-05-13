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

## Assets to swap in

Some slides reference `./assets/*.svg` placeholders. Replace each with a real image (PNG/JPG) at the same path — the markup is already in place.

- `assets/ghibli-galileo.svg` — Ghibli-style: a child holding a lantern at the edge of a forest of branching ideas.
- `assets/ghibli-crystals.svg` — Ghibli-style: crystalline knowledge structures growing across parallel branches of reality.
- `assets/meme-galileo.svg` — Galileo / "eppur si muove" meme.

Once you save a real image at the same path (you can also keep the SVG and add a real one alongside, then edit `slides.md`), it will appear automatically.
