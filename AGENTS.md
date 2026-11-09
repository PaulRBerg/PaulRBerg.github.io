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
prose, which breaks the decks. Preserve `slides/cce-2026/NOTES.md` verbatim. Use the pinned
`reveal.js` npm package for Reveal decks through `src/layouts/PresentationLayout.astro`.

## AI-generated images

For every image generated with `$imagegen` or an analogous AI image skill, include the X logo and
`@PaulRBerg` in the bottom-right corner.

For blog social previews, use 1200 × 630 images with inset text and branding. Verify that a centered
16:9 crop preserves all content before publishing.

## Speaking

Keep `src/pages/speaking.md` sections in this order: Podcasts, Talks, Slides. Read
[slides/AGENTS.md](slides/AGENTS.md) before importing presentations or adding talks to the speaking
archive. Reference Slidev assets with deck-relative paths such as `img/foo.svg`. Build each Slidev
deck with its `/presentations/<deck>/` base URL. Keep the CCE paper in
`slides/cce-2026/public/Draft Paper.pdf` so deck rebuilds preserve its legacy URL.

## Deployment and commits

Use Conventional Commits with per-deck scopes such as `feat(cce-2026): ...` and
`chore(frontiers-2026): ...`.

Deploy the static site with Cloudflare Workers and the pinned local Wrangler. `wrangler.jsonc` is
the source of truth for Worker `prberg-site`, its account, `dist/` assets, and the two custom
domains `prberg.com` and `www.prberg.com`. Keep `workers_dev` and `preview_urls` disabled. Use
`just deploy-dry-run` to build the complete site and validate without publishing; use
`just deploy-prod` for an explicitly authorized production deployment. `just preview` is local. No
Astro adapter or Worker script is required. Keep automatic trailing-slash handling and `404-page`
fallback so Astro directory indexes and `404.html` retain their intended behavior. Keep `.ai/`,
`.wrangler/`, generated output, and secret files out of Git and published assets.

Cloudflare Workers Builds should build `main` using `bun run build`, then deploy using
`bunx wrangler deploy`, with `BUN_VERSION=1.4.4` and `NODE_VERSION=24` or newer. The Git integration
and build settings are managed in Cloudflare. Always build both Slidev decks before `build:site`;
the full build also generates the Pagefind search index and Markdown exports.

Canonicalize `www.prberg.com` with a Cloudflare Single Redirect Rule that preserves the path and
query string. Workers static-asset `_redirects` does not support domain-level redirects. Keep both
custom domains attached so the zone rule can redirect `www` requests.

## SEO and agent discovery

Use `src/utils/seo.ts` for production canonical URLs, social image URLs, and safe JSON-LD
serialization. Keep article canonical, Open Graph, and structured-data URLs identical. Preserve
deliberate external canonical overrides. Give indexable pages descriptive titles and page-specific
descriptions. Keep search, 404, and redirect pages out of the sitemap. Search and 404 pages use
`noindex,follow`.

Astro builds with `trailingSlash: "always"`, and Workers static assets answer slash-less paths with
a 307. Write every internal link with its trailing slash (`/posts/`, `/about/`) so Googlebot never
has to follow a redirect; Search Console reports slash-less links as "Page with redirect". Keep
legacy blog paths in `public/_redirects` as 301 rules. They outrank the meta-refresh pages that
Astro's `redirects` config generates. Keep the Cloudflare zone setting "Always Use HTTPS" on so
`http://` requests redirect instead of serving a duplicate page.

Keep `/services` accessible by direct link only. Exclude it from navigation, internal search, the
sitemap, and generated discovery exports. Preserve its `noindex,follow` metadata.

Google Search Console verifies the `prberg.com` domain property under `paul.razvan.berg@gmail.com`.
Preserve Cloudflare TXT record `7b42da67351e301fabf9094ef984af87` in the `prberg.com` zone; it
maintains ownership verification used by the Google Play developer account's verified `/services/`
website.

`build:site` generates `/llms.txt` and directory `index.md` exports from rendered, indexable HTML.
Keep Markdown alternate links aligned with these outputs. Exports require a canonical URL and
`<main>` content. Presentation pages link to `/llms.txt` without advertising unavailable Markdown.
Never export raw MDX, drafts, archived sources, or presentation notes. Preserve article metadata,
absolute links, images, code whitespace, tables, and footnotes. Run
`node --test src/utils/seo.test.ts src/utils/agentContent.test.ts` after changing this pipeline.
Verify generated files with `just build` and a production preview, rather than the dev server.

Keep robots crawling allowed and retain the sitemap directive. Content signals permit `search` and
`ai-input`; leave `ai-train` unspecified unless Paul requests a training policy. Cloudflare serves
static Markdown files at explicit URLs. Runtime `Accept: text/markdown` negotiation requires a
Worker script or proxy; static response headers can be configured with `public/_headers`.

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
