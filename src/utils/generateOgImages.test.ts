import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import type { CollectionEntry } from "astro:content";
import sharp from "sharp";
import { generateOgImageForPost, generateOgImageForSite } from "./generateOgImages.ts";

const assertTextInsideFrame = async (image: Buffer) => {
  const metadata = await sharp(image).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  // The right inset inside the card should contain only its pale background.
  const directory = mkdtempSync(path.join(tmpdir(), "prberg-og-"));
  try {
    const inset = path.join(directory, "inset.png");
    await sharp(image).extract({ height: 340, left: 980, top: 100, width: 60 }).toFile(inset);
    const stats = await sharp(inset).stats();
    assert.ok(
      stats.channels.every(({ min }) => min > 200),
      "Text escapes the image frame"
    );
  } finally {
    rmSync(directory, { recursive: true });
  }
};

await test("the complete site description wraps inside its OG frame", async () => {
  await assertTextInsideFrame(generateOgImageForSite());
});

await test("long titles, unbroken words, and XML characters fit in post OG images", async () => {
  for (const title of [
    "The Agent Autonomy Trifecta: Memory, Self-Improvement, and Coordination",
    `${"W".repeat(100)} & <a title>`
  ]) {
    const post: CollectionEntry<"blog"> = {
      collection: "blog",
      data: {
        author: "Paul & Berg",
        description: "Test post",
        pubDatetime: new Date("2026-10-13T00:00:00Z"),
        tags: [],
        title
      },
      id: "test-post"
    };
    // eslint-disable-next-line no-await-in-loop -- Keep native renderers sequential to bound test memory.
    await assertTextInsideFrame(generateOgImageForPost(post));
  }
});
