import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/content/blog";
const publicOrRemoteImage = z
  .string()
  .refine((value) => value.startsWith("/") || /^https?:\/\//u.test(value), {
    message: "Expected a public path or absolute URL"
  });

const blog = defineCollection({
  loader: glob({ base: `./${BLOG_PATH}`, pattern: "**/[^_]*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      canonicalURL: z.string().optional(),
      description: z.string(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      hideEditPost: z.boolean().optional(),
      modDatetime: z.coerce.date().optional().nullable(),
      ogImage: publicOrRemoteImage.or(image()).optional(),
      pubDatetime: z.coerce.date(),
      tags: z.array(z.string()).default(["others"]),
      timezone: z.string().optional(),
      title: z.string(),
      twitterImage: publicOrRemoteImage.or(image()).optional()
    })
});

export const collections = { blog };
