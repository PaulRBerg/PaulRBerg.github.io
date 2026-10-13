import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import { SITE } from "../config.ts";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const fontFamily = "ui-monospace, SFMono-Regular, monospace";
const textWidth = (lines: string[], fontSize: number) => {
  const spans = lines
    .map((line, index) => `<tspan x="0" y="${index * fontSize * 1.2}">${escapeXml(line)}</tspan>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><text font-family="${fontFamily}" font-size="${fontSize}" font-weight="700">${spans}</text></svg>`;
  return new Resvg(svg).getBBox()?.width ?? 0;
};

const wrapText = (text: string, maxCharacters: number) => {
  const lines: string[] = [];
  let line = "";
  for (const word of text.trim().split(/\s+/u)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxCharacters) {
      line = candidate;
      continue;
    }
    if (line) {
      lines.push(line);
    }
    if (word.length <= maxCharacters) {
      line = word;
      continue;
    }
    line = "";
    for (const character of word) {
      if (line.length + character.length > maxCharacters) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) {
    lines.push(line);
  }
  return lines;
};

const fitText = (text: string, initialFontSize: number, maxHeight: number) => {
  let fontSize = initialFontSize;
  let maxCharacters = Math.floor(812 / (fontSize * 0.6));
  let lines = wrapText(text, maxCharacters);
  while (true) {
    const width = textWidth(lines, fontSize);
    if (width > 812) {
      maxCharacters = Math.max(1, Math.floor((maxCharacters * 812) / width));
    } else if (lines.length * fontSize * 1.2 > maxHeight) {
      fontSize *= 0.9;
      maxCharacters = Math.floor(812 / (fontSize * 0.6));
    } else {
      break;
    }
    lines = wrapText(text, maxCharacters);
  }
  return { fontSize, height: lines.length * fontSize * 1.2, lines };
};

const textSpans = (lines: string[], fontSize: number, top: number) =>
  lines
    .map(
      (line, index) =>
        `<tspan x="144" y="${top + fontSize + index * fontSize * 1.2}">${escapeXml(line)}</tspan>`
    )
    .join("");

const createOgSvg = (title: string, subtitle: string) => {
  const safeHost = escapeXml(new URL(SITE.website).hostname);
  const titleText = fitText(title, 62, 210);
  const subtitleTop = 128 + titleText.height + 40;
  const subtitleText = fitText(subtitle, 28, 440 - subtitleTop);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#fefbfb" />
      <rect x="126" y="81" width="948" height="468" rx="12" fill="#ecebeb" opacity="0.9" stroke="#000" stroke-width="4" />
      <rect x="96" y="56" width="948" height="468" rx="12" fill="#fefbfb" stroke="#000" stroke-width="4" />
      <text fill="#111" font-family="${fontFamily}" font-size="${titleText.fontSize}" font-weight="700">
        ${textSpans(titleText.lines, titleText.fontSize, 128)}
      </text>
      <text fill="#111" font-family="${fontFamily}" font-size="${subtitleText.fontSize}">
        ${textSpans(subtitleText.lines, subtitleText.fontSize, subtitleTop)}
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
