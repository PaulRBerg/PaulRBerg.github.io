import type { APIContext } from "astro";
import type { CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { getRouteableBlogPosts } from "@/utils/blog";
import { SITE } from "@/config";

export const getStaticPaths = async () => {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const posts = await getRouteableBlogPosts();

  return posts
    .filter((post) => post.data.ogImage === undefined || post.data.ogImage === "")
    .map((post) => ({
      params: { slug: getPath(post.id, post.filePath, false) },
      props: post
    }));
};

export const GET = ({ props }: APIContext<CollectionEntry<"blog">>) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
  }

  const buffer = generateOgImageForPost(props);
  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" }
  });
};
