import { SITE } from "../config.ts";

/** Directory pages use production URLs, regardless of the build or request origin. */
export const pageURL = (pathname: string, canonicalOverride?: string | URL): string => {
  if (canonicalOverride !== undefined) {
    return canonicalOverride.toString();
  }
  const url = new URL(pathname, SITE.website);
  if (!url.pathname.endsWith("/") && !/\.[^/]+$/u.test(url.pathname)) {
    url.pathname += "/";
  }
  url.search = "";
  url.hash = "";
  return url.toString();
};

export const socialImageURL = (image: string): string => new URL(image, SITE.website).toString();

export const markdownURL = (pathname: string): string =>
  new URL("index.md", pageURL(pathname)).pathname;

export const serializeStructuredData = (data: unknown): string =>
  JSON.stringify(data).replaceAll("<", "\\u003c");
