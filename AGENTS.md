# AGENTS.md

Personal GitHub Pages site hosting slide decks, served at [prberg.com](https://prberg.com). Two kinds of decks live under
`presentations/`: static reveal.js pages and Slidev (Vue) apps. CI builds the Slidev decks and publishes the whole tree
to GitHub Pages.

## Stack

- **Static decks** — plain `index.html` using the [reveal.js](https://revealjs.com) submodule at `reveal-js/`.
- **Slidev decks** — [Slidev](https://sli.dev) (Vue 3), bundled with Vite.
- **Package manager** — Bun (pinned to 1.3.14 in CI).
- **Secrets** — dotenvx (encrypted `.env` committed; `.env.keys` never committed).
- **Formatting** — Prettier + EditorConfig.
- **Hosting** — GitHub Pages via GitHub Actions (Jekyll disabled with `.nojekyll`).

## Commands

The repo root has no package manager; commands run inside a Slidev deck directory or against the submodule.

### Setup

- `git submodule update --init --recursive` — fetch the `reveal-js` submodule (required for the static decks).
- `npx prettier . --write` — format the repo (respects `.prettierignore`).

### Slidev decks (run inside `presentations/<deck>/`, e.g. `cce-2026`, `frontiers-2026`)

- `bun install` — install deck dependencies.
- `bun run dev` — start Slidev with live reload at <http://localhost:3030>.
- `bun run build` — build the deck to `dist/`.
- `bun run export` — export the deck to PDF.
- `bun run deploy` — build and deploy to Vercel (needs `.env` with `VERCEL_TOKEN`; runs through dotenvx).

### Deploy the site

- Push to `main` → `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
- The workflow builds each Slidev deck with `slidev build --base /presentations/<deck>/` so asset URLs resolve under the
  subpath, rsyncs everything else as-is, and touches `_site/.nojekyll`.

## Project Structure

- `presentations/` — one directory per talk.
  - Static reveal.js decks (`ethcc-2023`, `ethcluj-2025`, `ratfest-2024`, `ratfest-2025`, `solidity-summit-2023`,
    `spearbit-2023`) — `index.html` linking `../../reveal-js/dist/...`, plus an `img/` folder (and usually an `og.jpg`
    social image).
  - Slidev decks (`cce-2026`, `frontiers-2026`) — `slides.md` (+ `slides/` partials), `components/`, `public/img/`,
    `style.css`, built to `dist/`.
  - `shared/img/` — images shared across decks.
- `reveal-js/` — git submodule ([hakimel/reveal.js](https://github.com/hakimel/reveal.js), `master`). Do not edit.
- `.github/workflows/deploy.yml` — build + deploy pipeline.
- `CNAME` — custom domain (`prberg.com`).
- `pfp-2022.jpg` — profile image used by decks.

## Code Style

- Prettier: `printWidth` 120, `trailingComma: all`, `proseWrap: always` for Markdown (`.prettierrc.yml`).
- `.prettierignore` excludes `presentations/**/slides.md` (Slidev's Markdown dialect isn't standard).
- EditorConfig: UTF-8, LF, 2-space indent, final newline, trim trailing whitespace.
- markdownlint defaults with `MD003` (heading style) disabled.
- VS Code formats on save (`.vscode/settings.json`).

## Conventions

- **Commits** — Conventional Commits with a per-deck scope: `feat(cce-2026): ...`, `chore(frontiers-2026): ...`, `ci: ...`.
- **Secrets** — managed by dotenvx. Commit the encrypted `.env`; never commit `.env.keys`.
- **Slidev asset paths** — reference assets deck-relative (e.g. `img/foo.svg`); Vite copies `public/` to the deck root at
  build time. Always build with the matching `--base` so URLs resolve under `/presentations/<deck>/`.
- **Jekyll is off** — CI ships `.nojekyll`; don't rely on Jekyll processing (Vite's `_`-prefixed chunks would be stripped).

## Contribution Workflow

- Default branch: `main`.
- Pushing to `main` auto-deploys via GitHub Actions; there is no manual publish step.
- Use Conventional Commit messages and run `npx prettier . --write` before committing.
