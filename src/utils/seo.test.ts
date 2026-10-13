import assert from "node:assert/strict";
import { test } from "node:test";
import { markdownURL, pageURL, serializeStructuredData, socialImageURL } from "./seo.ts";

await test("canonical pages use production directory URLs without request state", () => {
  assert.equal(
    pageURL("/posts/2018/radical-markets?highlight=foo#data"),
    "https://prberg.com/posts/2018/radical-markets/"
  );
  assert.equal(pageURL("/"), "https://prberg.com/");
  assert.equal(pageURL("/404.html"), "https://prberg.com/404.html");
});

await test("explicit canonical overrides and external images retain their URLs", () => {
  const external = "https://example.com/original?version=1";
  assert.equal(pageURL("/posts/example", external), external);
  assert.equal(pageURL("/posts/example", new URL(external)), external);
  assert.equal(socialImageURL("/og.png"), "https://prberg.com/og.png");
  assert.equal(socialImageURL(external), external);
});

await test("Markdown discovery uses the rendered route directory", () => {
  assert.equal(markdownURL("/"), "/index.md");
  assert.equal(markdownURL("/posts/example"), "/posts/example/index.md");
});

await test("JSON-LD cannot close its script element and round trips its data", () => {
  const data = { headline: "</script><script>alert(1)</script>" };
  const serialized = serializeStructuredData(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});
