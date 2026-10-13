/* eslint-disable require-await -- Fetch stubs preserve the asynchronous API without real I/O. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { getLinkPreview, parseLinkPreview } from "./linkPreview.ts";

await test("OpenGraph metadata takes precedence and decodes HTML entities", () => {
  const preview = parseLinkPreview(
    `
    <title>Fallback title</title>
    <meta name="twitter:title" content="Twitter title">
    <meta content="Skills &amp; workflows" property="og:title">
    <meta property="og:description" content="PRB&#39;s collection">
    <meta property="og:image" content="/preview.png?a=1&amp;b=2">
    <meta property="og:image" content="/second.png">
    <meta property="og:image:alt" content="Repository preview">
  `,
    "https://example.com/project"
  );
  assert.deepEqual(preview, {
    description: "PRB's collection",
    image: "https://example.com/preview.png?a=1&b=2",
    imageAlt: "Repository preview",
    title: "Skills & workflows"
  });
});

await test("Twitter metadata and ordinary HTML metadata provide fallbacks", () => {
  const preview = parseLinkPreview(
    `
    <title>Page &amp; title</title>
    <meta name="description" content="Page description">
    <meta name="twitter:image" content="../image.png">
  `,
    "https://example.com/path/page"
  );
  assert.equal(preview.title, "Page & title");
  assert.equal(preview.description, "Page description");
  assert.equal(preview.image, "https://example.com/image.png");
  assert.equal(
    parseLinkPreview('<meta name="twitter:title" content="Twitter title">', "https://example.com")
      .title,
    "Twitter title"
  );
});

await test("missing metadata and unsafe image URLs never produce an image", () => {
  // eslint-disable-next-line no-script-url -- Verify that untrusted metadata cannot inject a script URL.
  for (const value of ["javascript:alert(1)", "data:image/svg+xml,test", "http://["]) {
    assert.equal(
      parseLinkPreview(`<meta property="og:image" content="${value}">`, "https://example.com")
        .image,
      undefined
    );
  }
  assert.equal(parseLinkPreview("<body>No metadata</body>", "https://example.com").title, "");
});

await test("fetch failures, timeouts, and non-HTML responses allow the plain link fallback", async (context) => {
  context.mock.method(console, "warn", () => {});
  for (const response of [
    new Response("Not found", { status: 404 }),
    new Response("binary", { headers: { "content-type": "image/png" } })
  ]) {
    const fetchMock = context.mock.method(globalThis, "fetch", async () => response);
    // eslint-disable-next-line no-await-in-loop -- Each case owns the global fetch mock until it completes.
    assert.equal(await getLinkPreview("https://example.com"), null);
    fetchMock.mock.restore();
  }
  context.mock.method(globalThis, "fetch", async () => {
    throw new DOMException("Timed out", "TimeoutError");
  });
  assert.equal(await getLinkPreview("https://example.com"), null);
});

await test("relative images resolve against the final URL after a redirect", async (context) => {
  const response = new Response(
    '<title>Redirected page</title><meta property="og:image" content="image.png">',
    { headers: { "content-type": "text/html" } }
  );
  Object.defineProperty(response, "url", { value: "https://example.com/final/page" });
  context.mock.method(globalThis, "fetch", async () => response);
  const preview = await getLinkPreview("https://example.com/old-page");
  assert.equal(preview?.image, "https://example.com/final/image.png");
});
