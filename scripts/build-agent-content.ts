import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAgentPage, buildLlmsIndex } from "../src/utils/agentContent.ts";
import type { AgentPage } from "../src/utils/agentContent.ts";

const outputDirectory = new URL("../dist/", import.meta.url);
const homepageHtml = await readFile(new URL("index.html", outputDirectory), "utf-8");
const homepage = buildAgentPage(homepageHtml);
if (!homepage || new URL(homepage.url).pathname !== "/") {
  throw new Error(
    "The built homepage must have an absolute canonical URL and indexable main content"
  );
}
const root = fileURLToPath(outputDirectory);
const pages: AgentPage[] = [];

const exportDirectory = async (directory: string): Promise<void> => {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await exportDirectory(filename);
      } else if (entry.isFile() && entry.name === "index.html") {
        const route = path
          .relative(root, filename)
          .split(path.sep)
          .join("/")
          .replace(/index\.html$/u, "");
        const url = new URL(route, homepage.url).href;
        const html =
          filename === path.join(root, "index.html")
            ? homepageHtml
            : await readFile(filename, "utf-8");
        const page = buildAgentPage(html, url);
        if (page) {
          await writeFile(path.join(directory, "index.md"), page.markdown);
          pages.push(page);
        }
      }
    })
  );
};

await exportDirectory(root);
await writeFile(new URL("llms.txt", outputDirectory), buildLlmsIndex(pages));
console.log(`Generated Markdown exports for ${pages.length} published pages and dist/llms.txt`);
