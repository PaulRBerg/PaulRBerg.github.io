// Keep in sync with .oxfmtrc.json
export default {
  astroCompressHTML: "html",
  overrides: [{ files: ["*.md", "*.mdx"], options: { proseWrap: "always" } }],
  plugins: ["prettier-plugin-astro"],
  printWidth: 100
};
