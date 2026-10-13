import { fromHtml } from "hast-util-from-html";

const readMetadata = (html: string) => {
  const document = fromHtml(html);
  const root = document.children
    .filter((node) => node.type === "element")
    .find((node) => node.tagName === "html");
  const head = root?.children
    .filter((node) => node.type === "element")
    .find((node) => node.tagName === "head");
  const metadata = new Map<string, string>();
  let pageTitle = "";

  for (const node of head?.children ?? []) {
    if (node.type !== "element") {
      continue;
    }
    if (node.tagName === "title") {
      pageTitle = node.children
        .filter((child) => child.type === "text")
        .map((child) => child.value)
        .join("")
        .trim();
    }
    if (node.tagName === "meta") {
      const key = node.properties.property ?? node.properties.name;
      const { content } = node.properties;
      if (typeof key === "string" && typeof content === "string" && content.trim()) {
        const name = key.toLowerCase();
        if (!metadata.has(name)) {
          metadata.set(name, content.trim());
        }
      }
    }
  }

  return { metadata, pageTitle };
};

export const parseLinkPreview = (html: string, pageUrl: string) => {
  const { metadata, pageTitle } = readMetadata(html);
  const imageValue = metadata.get("og:image") ?? metadata.get("twitter:image");
  const imageUrl = imageValue === undefined ? null : URL.parse(imageValue, pageUrl);
  const image = imageUrl && /^https?:$/u.test(imageUrl.protocol) ? imageUrl.href : undefined;

  return {
    description:
      metadata.get("og:description") ??
      metadata.get("twitter:description") ??
      metadata.get("description"),
    image,
    imageAlt: metadata.get("og:image:alt") ?? metadata.get("twitter:image:alt") ?? "",
    title: metadata.get("og:title") ?? metadata.get("twitter:title") ?? pageTitle
  };
};

/** Fetch only author-supplied links, during Astro's server rendering/build. */
export const getLinkPreview = async (href: string) => {
  const url = new URL(href);
  if (!/^https?:$/u.test(url.protocol)) {
    throw new Error("Link previews require an HTTP(S) URL");
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    if (response.headers.get("content-type")?.includes("text/html") !== true) {
      throw new Error("Expected an HTML page");
    }
    return parseLinkPreview(await response.text(), response.url || href);
  } catch (error) {
    console.warn(`[LinkPreview] Could not load ${href}:`, error);
    return null;
  }
};
