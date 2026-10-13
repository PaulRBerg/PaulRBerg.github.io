import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

export type BlogEntry = CollectionEntry<"blog">;

export interface BlogMonthGroup {
  month: number;
  name: string;
  posts: BlogEntry[];
}

export interface BlogYearGroup {
  year: number;
  months: BlogMonthGroup[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

const getPublishedTimestamp = (post: BlogEntry) => new Date(post.data.pubDatetime).getTime();

const getSortTimestamp = (post: BlogEntry) =>
  new Date(post.data.modDatetime ?? post.data.pubDatetime).getTime();

export const isVisibleBlogPost = ({ data }: BlogEntry) => {
  const isPublishTimePassed =
    Date.now() > new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return data.draft !== true && (import.meta.env.DEV || isPublishTimePassed);
};

export const sortBlogPosts = (posts: BlogEntry[]) =>
  posts.toSorted((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

export const getVisibleBlogPosts = async () => {
  const posts = await getCollection("blog");
  return sortBlogPosts(posts.filter(isVisibleBlogPost));
};

export const getRouteableBlogPosts = getVisibleBlogPosts;

export const groupBlogPostsByYearAndMonth = (posts: BlogEntry[]) => {
  const groupedPosts = new Map<number, Map<number, BlogEntry[]>>();

  for (const post of posts.toSorted(
    (a, b) => getPublishedTimestamp(b) - getPublishedTimestamp(a)
  )) {
    const publishedDate = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      timeZone: post.data.timezone ?? SITE.timezone,
      year: "numeric"
    }).formatToParts(post.data.pubDatetime);
    const year = Number(publishedDate.find((part) => part.type === "year")?.value);
    const month = Number(publishedDate.find((part) => part.type === "month")?.value) - 1;
    const yearGroup = groupedPosts.get(year) ?? new Map<number, BlogEntry[]>();
    const monthGroup = yearGroup.get(month) ?? [];

    monthGroup.push(post);
    yearGroup.set(month, monthGroup);
    groupedPosts.set(year, yearGroup);
  }

  return [...groupedPosts.entries()]
    .map(([year, months]) => ({
      months: [...months.entries()]
        .map(([month, monthPosts]) => ({
          month,
          name: MONTH_NAMES[month],
          posts: monthPosts
        }))
        .toSorted((monthA, monthB) => monthB.month - monthA.month),
      year
    }))
    .toSorted((yearA, yearB) => yearB.year - yearA.year);
};
