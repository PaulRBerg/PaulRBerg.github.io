import rss from "@astrojs/rss";
import { getPath } from "@/utils/getPath";
import { SITE } from "@/config";
import { getVisibleBlogPosts } from "@/utils/blog";

export const GET = async () => {
  const posts = await getVisibleBlogPosts();
  return await rss({
    description: SITE.desc,
    items: posts.map(({ data, id, filePath }) => ({
      description: data.description,
      link: getPath(id, filePath),
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      title: data.title
    })),
    site: SITE.website,
    title: SITE.title
  });
};
