# prberg

Personal website, blog, and presentation archive built with Astro and Bun at
[prberg.com](https://prberg.com). Slidev sources under `slides/` build into the git-ignored
`public/presentations/` directories. Reveal decks use the npm Reveal.js runtime through Astro.

Run commands from the repository root. Invoke package scripts and local binaries with
`bun run <script|bin>`, not `na`. Install dependencies with `bun install --frozen-lockfile`. Use
`just dev`, `just build`, and `just preview` for development, production builds, and previews. Use
`bun run build:slides` to rebuild only the Slidev decks.

## Checks

Run `just full-write` and then `just full-check` after every change, before committing. Do not wait
until the end of a task. Keep `just full-check` passing at each commit. Scope formatters and fixes
to changed files when other agents share the working tree.

- `just full-check` runs `astro check`, oxfmt, Prettier, and oxlint.
- `just full-write` applies the oxfmt, Prettier, and oxlint fixes.

## Formatting

Use oxfmt for TS, JS, and JSON. Keep its exclusions in `.oxfmtrc.json`. Use Prettier for `.astro`,
`.md`, and `.mdx` files. Keep `.prettierrc.mjs` in sync with `.oxfmtrc.json`. Exclude Slidev
entrypoints (`slides/*/slides.md`) from Prettier. Prettier turns their `---` slide separators into
prose, which breaks the decks. Preserve `slides/cce-2026/NOTES.md` verbatim. Leave the retained
`reveal-js/` submodule and `.gitmodules` untouched. Exclude that submodule from formatters, lint,
type checks, and builds.

## AI-generated images

For every image generated with `$imagegen` or an analogous AI image skill, include the X logo and
`@PaulRBerg` in the bottom-right corner.

## Speaking

Keep `src/pages/speaking.md` sections in this order: Podcasts, Talks, Slides. Read
[slides/AGENTS.md](slides/AGENTS.md) before importing presentations or adding talks to the speaking
archive. Reference Slidev assets with deck-relative paths such as `img/foo.svg`. Build each Slidev
deck with its `/presentations/<deck>/` base URL. Keep the CCE paper in
`slides/cce-2026/public/Draft Paper.pdf` so deck rebuilds preserve its legacy URL.

## Deployment and commits

Use Conventional Commits with per-deck scopes such as `feat(cce-2026): ...` and
`chore(frontiers-2026): ...`. Use `ci: ...` for workflow changes. Push to `main` to deploy through
`.github/workflows/deploy.yml`. Build the complete site with `bun run build`. Upload `dist/` with
`.nojekyll` to GitHub Pages. Keep `public/CNAME` set to `prberg.com`. Keep `.ai/`, generated output,
and secret files out of Git and published assets.

CI caches `node_modules/.astro` and both Slidev outputs. Run `bun run build:site` only after
building or restoring the decks. If deck inputs move outside `slides/`, update the presentation
cache key in `.github/workflows/deploy.yml` to include them.

## Blog Link Previews

Use `.mdx` for posts that import `src/components/LinkPreview.astro`. Render standalone links with
`<LinkPreview href="https://example.com" />`. Metadata is fetched at build time. Unavailable pages
fall back to ordinary links. Run `node --test src/utils/linkPreview.test.ts` after changing metadata
parsing or fetching.

## Google Analytics

Use `paul.razvan.berg@gmail.com` and Cloud project `cli-paul-razvan-berg` for the `analytics` MCP
server. The site's GA4 property is `400647317` (`@PaulRBerg`), with a web stream for
`https://prberg.com` and measurement ID `G-TJ49HZ4TM9`.

Keep tracking restricted to `prberg.com` and `www.prberg.com` in `public/scripts/analytics.js`. The
stream's enhanced measurement tracks browser history changes, including Astro navigation. Do not add
manual pageview events while this setting is enabled. Include the shared script in new presentation
entrypoints.

Keep the OAuth client JSON and Application Default Credentials outside Git. To reauthenticate, run
the command below. Include the identity scopes so `gcloud` can validate the selected account.

```sh
gcloud auth application-default login paul.razvan.berg@gmail.com \
  --client-id-file="$HOME/.config/gcloud/analytics-mcp-client.json" \
  --scopes=openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform
```
