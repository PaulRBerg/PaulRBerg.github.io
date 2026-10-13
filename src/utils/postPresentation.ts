import { slugifyStr } from "@/utils/slugify";

export const getPostTransitionName = (title: string) => slugifyStr(title.replaceAll(".", "-"));

export const getReadingTime = (content: string) => {
  const sanitizedContent = content
    .replaceAll(/```[\s\S]*?```/gu, " ")
    .replaceAll(/`[^`]*`/gu, " ")
    .replaceAll(/!\[[^\u005D]*\]\([^)]*\)/gu, " ")
    .replaceAll(/\[(?<text>[^\u005D]*)\]\([^)]*\)/gu, " $<text> ")
    .replaceAll(/<[^>]+>/gu, " ");

  const wordCount = sanitizedContent.match(/\b[\p{L}\p{N}']+\b/gu)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} min read`;
};
