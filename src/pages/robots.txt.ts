import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /
Content-Signal: search=yes, ai-input=yes

Sitemap: ${sitemapURL.href}
# AI-readable content index: ${new URL("llms.txt", sitemapURL).href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
