import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const createOgSvg = (title: string, subtitle: string) => {
  const safeHost = escapeXml(new URL(SITE.website).hostname);
  const safeSubtitle = escapeXml(subtitle);
  const safeTitle = escapeXml(title);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#fefbfb" />
      <rect x="126" y="81" width="948" height="468" rx="12" fill="#ecebeb" opacity="0.9" stroke="#000" stroke-width="4" />
      <rect x="96" y="56" width="948" height="468" rx="12" fill="#fefbfb" stroke="#000" stroke-width="4" />
      <text x="144" y="190" fill="#111" font-family="ui-monospace, SFMono-Regular, monospace" font-size="62" font-weight="700">
        ${safeTitle}
      </text>
      <text x="144" y="290" fill="#111" font-family="ui-monospace, SFMono-Regular, monospace" font-size="28">
        ${safeSubtitle}
      </text>
      <text x="956" y="492" fill="#111" font-family="ui-monospace, SFMono-Regular, monospace" font-size="26" font-weight="700" text-anchor="end">
        ${safeHost}
      </text>
    </svg>
  `.trim();
};

const svgBufferToPngBuffer = (svg: string) => {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
};

export const generateOgImageForPost = (post: CollectionEntry<"blog">) =>
  svgBufferToPngBuffer(createOgSvg(post.data.title, `by ${post.data.author}`));

export const generateOgImageForSite = () =>
  svgBufferToPngBuffer(createOgSvg(SITE.title, SITE.desc));
