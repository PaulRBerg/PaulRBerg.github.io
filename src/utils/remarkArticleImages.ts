import type { RehypePlugin, RemarkPlugin } from "@astrojs/markdown-remark";
import type { Properties, RootContent as HtmlContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import type { Html, Image, RootContent } from "mdast";

declare module "mdast" {
  interface Data {
    hProperties?: Properties | undefined;
  }
}

const articleAsset = /(?:^|\/)assets\/posts\/(?<asset>.+)$/u;

// A historical article uses a sized HTML image. Make it eligible for Astro's
// Markdown asset pipeline without losing its authored dimensions.
const assetImageFromHtml = (node: Html): Image | undefined => {
  if (!/^\s*<img\b/iu.test(node.value)) {
    return undefined;
  }
  const fragment = fromHtml(node.value, { fragment: true });
  const [element] = fragment.children;
  if (
    fragment.children.length !== 1 ||
    element?.type !== "element" ||
    element.tagName !== "img" ||
    typeof element.properties.src !== "string" ||
    !articleAsset.test(element.properties.src)
  ) {
    return undefined;
  }
  const { src, alt, title, ...hProperties } = element.properties;
  return {
    alt: typeof alt === "string" ? alt : "",
    data: { hProperties },
    title: typeof title === "string" ? title : null,
    type: "image",
    url: src
  };
};

/** Prioritize the first article image and size the rest for Astro's asset pipeline. */
const remarkArticleImages: RemarkPlugin = () => (tree) => {
  let imageCount = 0;

  const walk = (nodes: RootContent[]) => {
    for (const [index, child] of nodes.entries()) {
      let node = child;
      if (node.type === "html") {
        node = assetImageFromHtml(node) ?? node;
        nodes[index] = node;
      }

      if (node.type === "image") {
        const assetPath = articleAsset.exec(node.url)?.groups?.asset;
        if (assetPath !== undefined && assetPath !== "") {
          const firstImage = imageCount === 0;
          imageCount += 1;
          node.data ??= {};
          const authoredWidth = node.data.hProperties?.width;
          node.data.hProperties = {
            ...node.data.hProperties,
            decoding: "async",
            ...(firstImage ? { fetchpriority: "high" } : {}),
            loading: firstImage ? "eager" : "lazy",
            sizes:
              typeof authoredWidth === "number"
                ? `(min-width: calc(${authoredWidth}px + 2rem)) ${authoredWidth}px, calc(100vw - 2rem)`
                : "(min-width: 48rem) 46rem, calc(100vw - 2rem)",
            // Keep GIF output and animation when generating responsive variants.
            ...(assetPath.endsWith(".gif") ? { format: "gif" } : {})
          };
        }
      }

      if ("children" in node) {
        walk(node.children);
      }
    }
  };

  walk(tree.children);
};

export default remarkArticleImages;

/** MDX normalizes HAST property names before converting images to components. */
const normalizeImageProperties = (nodes: HtmlContent[]) => {
  for (const node of nodes) {
    if (
      node.type === "element" &&
      node.tagName === "img" &&
      typeof node.properties.src === "string" &&
      articleAsset.test(node.properties.src)
    ) {
      const { fetchPriority } = node.properties;
      if (fetchPriority !== undefined) {
        node.properties.fetchpriority = fetchPriority;
        delete node.properties.fetchPriority;
      }
    }

    if ("children" in node) {
      normalizeImageProperties(node.children);
    }
  }
};

export const rehypeArticleImages: RehypePlugin = () => (tree) => {
  normalizeImageProperties(tree.children);
};
