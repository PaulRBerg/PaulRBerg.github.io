import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createMarkdownProcessor, unified } from "@astrojs/markdown-remark";
import type { RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import remarkArticleImages, { rehypeArticleImages } from "./remarkArticleImages.ts";

const plugins = {
  rehypePlugins: [rehypeArticleImages],
  remarkPlugins: [remarkArticleImages]
};

const imageMarkers = (nodes: RootContent[]): Record<string, unknown>[] =>
  nodes.flatMap((node) => {
    if (node.type === "element" && typeof node.properties.__astro_image_ === "string") {
      const marker: unknown = JSON.parse(node.properties.__astro_image_);
      assert.ok(typeof marker === "object" && marker !== null && "src" in marker);
      return [marker];
    }
    return "children" in node ? imageMarkers(node.children) : [];
  });

await test("Astro Markdown retains priority and sized GIF assets", async () => {
  const processor = await createMarkdownProcessor({ ...plugins, syntaxHighlight: false });
  const rendered = await processor.render(
    `![Cover](../../../assets/posts/2020/sample/cover.jpg)

![Diagram](../../../assets/posts/2020/sample/diagram.png)

<img src="../../../assets/posts/2020/sample/animation.gif" alt="Animation" width="350" height="350"/>

![External](https://example.com/image.jpg)`,
    { fileURL: new URL("../content/blog/2020/example.md", import.meta.url) }
  );
  const markers = imageMarkers(fromHtml(rendered.code, { fragment: true }).children);
  assert.equal(markers.length, 3);
  assert.equal(rendered.metadata.localImagePaths.length, 3);
  assert.equal(markers[0]?.loading, "eager");
  assert.equal(markers[0]?.fetchpriority, "high");
  assert.equal(markers[0]?.sizes, "(min-width: 48rem) 46rem, calc(100vw - 2rem)");
  for (const marker of markers.slice(1)) {
    assert.equal(marker.loading, "lazy");
    assert.equal(marker.fetchpriority, undefined);
  }
  assert.equal(markers[2]?.format, "gif");
  assert.equal(markers[2]?.width, 350);
  assert.equal(markers[2]?.height, 350);
  assert.equal(markers[2]?.sizes, "(min-width: calc(350px + 2rem)) 350px, calc(100vw - 2rem)");
  assert.match(rendered.code, /src="https:\/\/example\.com\/image\.jpg"/u);
});

await test("Astro MDX passes literal HTML metadata to Image and leaves LinkPreview alone", async () => {
  const processor = await unified(plugins).createMdxRenderer?.(
    { syntaxHighlight: false },
    { optimize: false, srcDir: new URL("../", import.meta.url) }
  );
  assert.ok(processor);
  const rendered = await processor.process(
    `![Cover](../../../assets/posts/2026/sample/cover.jpg)

![Diagram](../../../assets/posts/2026/sample/diagram.webp)

<LinkPreview href="https://example.com" />`,
    fileURLToPath(new URL("../content/blog/2026/example.mdx", import.meta.url)),
    {}
  );
  assert.match(rendered.code, /from "astro:assets"/u);
  assert.match(rendered.code, /from "\.\.\/\.\.\/\.\.\/assets\/posts\/2026\/sample\/cover\.jpg"/u);
  assert.match(rendered.code, /fetchpriority: "high"/u);
  assert.doesNotMatch(rendered.code, /fetchPriority/u);
  assert.match(rendered.code, /loading: "eager"/u);
  assert.match(rendered.code, /loading: "lazy"/u);
  assert.match(rendered.code, /_jsx\(LinkPreview, \{\s*href: "https:\/\/example\.com"\s*\}\)/u);
});
