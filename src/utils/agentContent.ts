import type { Element, Root, RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toMdast } from "hast-util-to-mdast";
import { gfmTableToMarkdown } from "mdast-util-gfm-table";
import { toMarkdown } from "mdast-util-to-markdown";

export interface AgentPage {
  title: string;
  description: string;
  url: string;
  canonicalUrl: string;
  published?: string;
  modified?: string;
  author?: string;
  article: boolean;
  markdown: string;
}

const elements = (node: Root | Element): Element[] =>
  node.children.flatMap((child) => (child.type === "element" ? [child, ...elements(child)] : []));

const textContent = (node: RootContent): string => {
  if (node.type === "text") {
    return node.value;
  }
  return node.type === "element" ? node.children.map(textContent).join("") : "";
};

const property = (node: Element, name: string): string => {
  const value = node.properties[name];
  if (Array.isArray(value)) {
    return value.join(" ");
  }
  return typeof value === "string" ? value : "";
};

const hasClass = (node: Element, name: string): boolean =>
  property(node, "className").split(/\s+/u).includes(name);

const removedTags = new Set([
  "script",
  "style",
  "button",
  "form",
  "input",
  "select",
  "textarea",
  "dialog",
  "svg",
  "nav",
  "header",
  "footer",
  "template"
]);

const cleanContent = (node: Root | Element, pageUrl: string): void => {
  node.children = node.children.filter((child) => {
    if (child.type !== "element") {
      return child.type === "text";
    }
    if (
      removedTags.has(child.tagName) ||
      child.properties.ariaHidden === "true" ||
      child.properties.hidden === true ||
      child.properties.dataPagefindIgnore !== undefined
    ) {
      return false;
    }

    // Expressive Code renders each line as nested divs, including line-number gutters.
    // Restore plain code before conversion so indentation and blank lines survive.
    if (child.tagName === "pre") {
      const code = child.children.find(
        (entry): entry is Element => entry.type === "element" && entry.tagName === "code"
      );
      const lines = elements(child).filter((entry) => hasClass(entry, "ec-line"));
      const value =
        lines.length > 0
          ? lines
              .map((line) => {
                const content = elements(line).find((entry) => hasClass(entry, "code"));
                // Empty rendered lines contain a newline placeholder.
                return textContent(content ?? line).replace(/\r?\n$/u, "");
              })
              .join("\n")
          : textContent(code ?? child);
      const language = property(child, "dataLanguage");
      child.children = [
        {
          children: [{ type: "text", value }],
          properties: language ? { className: [`language-${language}`] } : (code?.properties ?? {}),
          tagName: "code",
          type: "element"
        }
      ];
      return true;
    }

    // These spans are separate blocks visually, but have no whitespace in built HTML.
    if (hasClass(child, "link-preview-content")) {
      child.children = child.children
        .filter((entry) => entry.type !== "text" || entry.value.trim() !== "")
        .flatMap((entry, index) =>
          index === 0 ? [entry] : [{ type: "text", value: " — " }, entry]
        );
    }

    for (const name of ["href", "src"]) {
      const value = property(child, name);
      if (value) {
        const resolved = URL.parse(value, pageUrl);
        if (resolved) {
          child.properties[name] = resolved.href;
        }
      }
    }
    cleanContent(child, pageUrl);
    return true;
  });
};

/** Convert only rendered, indexable site content; never read authoring sources. */
export const buildAgentPage = (html: string, pageUrl?: string): AgentPage | null => {
  const document = fromHtml(html);
  const all = elements(document);
  const head = all.find((node) => node.tagName === "head");
  const headElements = head ? elements(head) : [];
  const metadata = new Map(
    headElements
      .filter((node) => node.tagName === "meta")
      .map((node) => [
        (property(node, "name") || property(node, "property")).toLowerCase(),
        property(node, "content")
      ])
  );
  const canonical = headElements.find(
    (node) => node.tagName === "link" && property(node, "rel").split(/\s+/u).includes("canonical")
  );
  const canonicalUrl = canonical ? URL.parse(property(canonical, "href"), pageUrl) : null;
  const url = pageUrl === undefined ? canonicalUrl : URL.parse(pageUrl);
  const main = all.find((node) => node.tagName === "main");
  const noindex = [...metadata].some(
    ([name, value]) =>
      (name === "robots" || name.endsWith("bot")) && /\b(?:noindex|none)\b/iu.test(value)
  );
  const redirect = headElements.some(
    (node) => node.tagName === "meta" && property(node, "httpEquiv").toLowerCase() === "refresh"
  );
  if (
    !main ||
    !canonicalUrl ||
    !url ||
    noindex ||
    redirect ||
    !/^https?:$/u.test(canonicalUrl.protocol) ||
    /^\/(?:search|404)(?:\/|\.|$)/u.test(url.pathname)
  ) {
    return null;
  }

  const article = elements(main).find(
    (node) => node.tagName === "article" && property(node, "id") === "article"
  );
  const heading = elements(main).find((node) => node.tagName === "h1");
  const titleNode = headElements.find((node) => node.tagName === "title");
  const titleElement = heading ?? titleNode;
  const title = titleElement ? textContent(titleElement).trim() : "";
  const content: Root = {
    children: article && heading ? [heading, ...article.children] : (article ?? main).children,
    type: "root"
  };
  cleanContent(content, url.href);
  const markdown = toMarkdown(toMdast(content), {
    extensions: [gfmTableToMarkdown()],
    fences: true
  });
  const page: AgentPage = {
    article: Boolean(article),
    author: metadata.get("author"),
    canonicalUrl: canonicalUrl.href,
    description: metadata.get("description") ?? "",
    markdown: "",
    modified: metadata.get("article:modified_time"),
    published: metadata.get("article:published_time"),
    title,
    url: url.href
  };
  const fields = {
    author: page.author,
    canonical_url: page.canonicalUrl,
    description: page.description,
    modified: page.modified,
    published: page.published,
    title: page.title,
    url: page.url
  };
  const frontmatter = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([name, value]) => `${name}: ${JSON.stringify(value)}`)
    .join("\n");
  page.markdown = `---\n${frontmatter}\n---\n\n${markdown}`;
  return page;
};

export const markdownUrl = (pageUrl: string): string => {
  const url = new URL(pageUrl);
  url.pathname = `${url.pathname.replace(/\/$/u, "")}/index.md`;
  url.search = "";
  url.hash = "";
  return url.href;
};

export const buildLlmsIndex = (pages: AgentPage[]): string => {
  const homepage = pages.find((page) => new URL(page.url).pathname === "/");
  if (!homepage) {
    throw new Error("The published homepage is required to generate llms.txt");
  }
  const { origin } = new URL(homepage.url);
  const author = homepage.author ?? "Paul Berg";
  const sections = [
    `# ${author}`,
    `> Personal website, blog, and speaking archive of ${author} (@PaulRBerg).`,
    "Read the Markdown exports below for the main content and publication metadata. " +
      "They are generated from published HTML; use the canonical HTML URLs for citations and fragments. " +
      "Presentation links in the speaking archive lead to the original decks.",
    `## Discovery\n\n- [Sitemap](${origin}/sitemap-index.xml)\n- [RSS feed](${origin}/rss.xml)`
  ];
  for (const [heading, article] of [
    ["Site pages", false],
    ["Published articles", true]
  ] as const) {
    const entries = pages
      .filter((page) => page.article === article)
      .toSorted((a, b) => a.url.localeCompare(b.url))
      .map((page) => {
        const label = page.title.replaceAll(/[\]\\[]/gu, "\\$&");
        const description = page.description.replaceAll(/\s+/gu, " ").trim();
        const date = page.published === undefined ? "" : ` (${page.published.slice(0, 10)})`;
        return (
          `- [${label}](${markdownUrl(page.url)})${date}: ${description} ` +
          `[HTML](${page.canonicalUrl})`
        );
      });
    sections.push(`## ${heading}\n\n${entries.join("\n")}`);
  }
  return `${sections.join("\n\n")}\n`;
};
