import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAgentPage, buildLlmsIndex, markdownUrl } from "./agentContent.ts";

const pageHtml = (content: string, extraHead = "") => `<!doctype html><html><head>
  <title>Article | Paul Razvan Berg</title>
  <link rel="canonical" href="https://prberg.com/posts/example/">
  <meta name="description" content="Published article description">
  <meta name="author" content="Paul Razvan Berg">
  <meta property="article:published_time" content="2026-10-13T12:00:00.000Z">
  ${extraHead}</head><body><header>Site navigation</header><main>${content}</main>
  <footer>Site footer</footer></body></html>`;

await test("published article exports preserve content and metadata while excluding controls", () => {
  const page = buildAgentPage(
    pageHtml(`
    <h1>Article &amp; title</h1><div>Reading time: 5 minutes</div><button>Reading preferences</button>
    <article id="article">
      <h2 id="details">Details</h2>
      <p>Read <a href="../related/">a related post</a> and <a href="#details">this section</a>.</p>
      <img src="/images/example.webp" alt="A useful diagram">
      <table><thead><tr><th>Name</th><th>Value</th></tr></thead>
        <tbody><tr><td>First</td><td>2</td></tr></tbody></table>
      <pre data-language="ts"><code>
        <div class="ec-line"><div class="gutter">1</div><div class="code"><span>const answer = 42;</span></div></div>
        <div class="ec-line"><div class="gutter">2</div><div class="code">&#10;</div></div>
        <div class="ec-line"><div class="gutter">3</div><div class="code">  console.log(answer);</div></div>
      </code></pre>
      <p>A claim<sup><a href="#user-content-fn-1">1</a></sup>.</p>
      <section data-footnotes><h2 class="sr-only">Footnotes</h2><ol><li id="user-content-fn-1">The source.</li></ol></section>
      <script>window.secret = true;</script><style>p { color: red }</style>
      <form>Subscribe<input></form><button>Copy code</button>
      <div aria-hidden="true">Decoration</div>
    </article><nav>Previous article</nav>
  `)
  );
  assert.ok(page);
  assert.equal(page.article, true);
  assert.equal(page.title, "Article & title");
  assert.equal(page.published, "2026-10-13T12:00:00.000Z");
  assert.match(page.markdown, /canonical_url: "https:\/\/prberg\.com\/posts\/example\/"/u);
  assert.match(page.markdown, /# Article & title\n/u);
  assert.match(page.markdown, /\[a related post\]\(https:\/\/prberg\.com\/posts\/related\/\)/u);
  assert.match(
    page.markdown,
    /\[this section\]\(https:\/\/prberg\.com\/posts\/example\/#details\)/u
  );
  assert.match(
    page.markdown,
    /!\[A useful diagram\]\(https:\/\/prberg\.com\/images\/example\.webp\)/u
  );
  assert.match(page.markdown, /\| Name\s+\| Value \|/u);
  assert.match(page.markdown, /```ts\nconst answer = 42;\n\n {2}console\.log\(answer\);\n```/u);
  assert.match(page.markdown, /https:\/\/prberg\.com\/posts\/example\/#user-content-fn-1/u);
  assert.match(page.markdown, /## Footnotes\n\n1\. The source\./u);
  assert.doesNotMatch(
    page.markdown,
    /Reading time|preferences|Copy code|Site navigation|Site footer|Previous article|secret|color: red|Subscribe|Decoration/u
  );
});

await test("plain code whitespace and rendered link preview anchors survive conversion", () => {
  const page = buildAgentPage(
    pageHtml(`<h1>Example</h1><article id="article">
    <pre><code class="language-python">if ready:\n    run()\n\n    finish()\n</code></pre>
    <a class="link-preview" href="https://example.com/resource"><span><img src="/preview.png" alt="Preview"></span><span class="link-preview-content"> <span class="link-preview-domain">example.com</span> <span class="link-preview-title">Resource title</span> <span class="link-preview-description">Resource description</span> </span></a>
  </article>`)
  );
  assert.ok(page);
  assert.match(page.markdown, /```python\nif ready:\n {4}run\(\)\n\n {4}finish\(\)\n```/u);
  assert.match(page.markdown, /Resource title/u);
  assert.match(page.markdown, /Resource description/u);
  assert.match(page.markdown, /example\.com — Resource title — Resource description/u);
  assert.doesNotMatch(page.markdown, /—\s*—/u);
  assert.match(page.markdown, /example\.com — Resource title — Resource description/u);
  assert.match(page.markdown, /https:\/\/example\.com\/resource/u);
  assert.match(page.markdown, /https:\/\/prberg\.com\/preview\.png/u);
});

await test("noindex, redirects, search, 404, and pages without canonical main content are skipped", () => {
  for (const head of [
    '<meta name="robots" content="noindex, follow">',
    '<meta name="googlebot" content="none">',
    '<meta http-equiv="refresh" content="0;url=/about/">'
  ]) {
    assert.equal(buildAgentPage(pageHtml("<h1>Skipped</h1>", head)), null);
  }
  for (const url of ["https://prberg.com/search/", "https://prberg.com/404.html"]) {
    assert.equal(buildAgentPage(pageHtml("<h1>Skipped</h1>"), url), null);
  }
  assert.equal(buildAgentPage("<main><h1>No canonical</h1></main>"), null);
  assert.equal(
    buildAgentPage('<link rel="canonical" href="https://prberg.com/"><p>No main</p>'),
    null
  );
});

await test("the content index lists actual Markdown exports separately from published articles", () => {
  const homepage = buildAgentPage(pageHtml("<h1>Home</h1>"), "https://prberg.com/");
  const article = buildAgentPage(
    pageHtml('<h1>Article</h1><article id="article"><p>Body</p></article>')
  );
  assert.ok(homepage);
  assert.ok(article);
  const index = buildLlmsIndex([article, homepage]);
  assert.match(index, /## Site pages\n\n- \[Home\]\(https:\/\/prberg\.com\/index\.md\)/u);
  assert.match(
    index,
    /## Published articles\n\n- \[Article\]\(https:\/\/prberg\.com\/posts\/example\/index\.md\) \(2026-10-13\)/u
  );
  assert.match(index, /\[HTML\]\(https:\/\/prberg\.com\/posts\/example\/\)/u);
  assert.match(index, /https:\/\/prberg\.com\/sitemap-index\.xml/u);
  assert.match(index, /https:\/\/prberg\.com\/rss\.xml/u);
  assert.equal(
    markdownUrl("https://prberg.com/about/?a=1#section"),
    "https://prberg.com/about/index.md"
  );
  assert.throws(() => buildLlmsIndex([article]), /homepage/u);
});
