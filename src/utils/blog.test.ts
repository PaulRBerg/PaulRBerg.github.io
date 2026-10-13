import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const runBlogAssertions = (assertions: string) => {
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `
        import assert from "node:assert/strict";
        import { registerHooks } from "node:module";
        // Astro supplies this virtual module during builds; only pure helpers are tested here.
        const hooks = registerHooks({
          resolve(specifier, context, nextResolve) {
            if (specifier === "astro:content") {
              return { shortCircuit: true, url: "data:text/javascript,export const getCollection = () => []" };
            }
            if (specifier === "@/config") {
              return nextResolve(new URL("./src/config.ts", import.meta.url).href, context);
            }
            return nextResolve(specifier, context);
          }
        });
        const { groupBlogPostsByYearAndMonth, sortBlogPosts } = await import("./src/utils/blog.ts");
        hooks.deregister();
        const post = (pubDatetime, timezone, modDatetime) => ({
          data: {
            modDatetime: modDatetime === undefined ? null : new Date(modDatetime),
            pubDatetime: new Date(pubDatetime),
            timezone
          }
        });
        ${assertions}
      `
    ],
    {
      cwd: fileURLToPath(new URL("../..", import.meta.url)),
      env: { ...process.env, TZ: "Asia/Tokyo" }
    }
  );
};

await test("archive calendar groups follow configured timezones regardless of build host", () => {
  runBlogAssertions(`
    const utcPost = post("2018-12-31T19:22:34Z");
    const newYorkPost = post("2020-01-01T00:30:00Z", "America/New_York");
    const groups = groupBlogPostsByYearAndMonth([utcPost, newYorkPost]);
    assert.deepEqual(
      groups.map(({ year, months }) => ({ months: months.map(({ name }) => name), year })),
      [
        { months: ["December"], year: 2019 },
        { months: ["December"], year: 2018 }
      ]
    );
    assert.equal(groups[0]?.months[0]?.posts[0], newYorkPost);
    assert.equal(groups[1]?.months[0]?.posts[0], utcPost);
  `);
});

await test("modification dates sort recent posts without changing publication groups or inputs", () => {
  runBlogAssertions(`
    const updatedPost = post("2020-02-01T00:00:00Z", undefined, "2026-10-13T00:00:00Z");
    const recentPost = post("2026-10-12T00:00:00Z");
    const posts = [recentPost, updatedPost];
    assert.deepEqual(sortBlogPosts(posts), [updatedPost, recentPost]);
    assert.deepEqual(posts, [recentPost, updatedPost]);
    assert.deepEqual(
      groupBlogPostsByYearAndMonth(posts).map(({ year }) => year),
      [2026, 2020]
    );
  `);
});
