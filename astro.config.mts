import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import tailwindcss from "@tailwindcss/vite";
import { astroExpressiveCode } from "astro-expressive-code";
import { defineConfig, envField, fontProviders } from "astro/config";
import { SITE } from "./src/config";
import remarkArticleImages, { rehypeArticleImages } from "./src/utils/remarkArticleImages";

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true
      })
    }
  },
  fonts: [
    {
      cssVariable: "--font-google-sans-code",
      fallbacks: ["monospace"],
      name: "Google Sans Code",
      provider: fontProviders.google(),
      styles: ["normal", "italic"],
      weights: [300, 400, 500, 600, 700]
    }
  ],
  image: {
    layout: "constrained",
    responsiveStyles: true
  },
  integrations: [
    astroExpressiveCode({
      defaultProps: {
        collapseStyle: "collapsible-auto",
        showLineNumbers: false,
        wrap: true
      },
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      styleOverrides: {
        borderRadius: "0.375rem",
        codeFontFamily: "var(--font-google-sans-code), monospace",
        codeFontSize: "0.875rem",
        uiFontFamily: "var(--font-google-sans-code), monospace"
      },
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
      themes: ["min-light", "night-owl"],
      useDarkModeMediaQuery: false
    }),
    mdx(),
    sitemap({
      filter: (page) =>
        ![
          "/search/",
          "/404/",
          "/404.html",
          "/2018/12/radical-markets/",
          "/2018/12/critique-radical-markets/"
        ].includes(new URL(page).pathname)
    })
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeArticleImages],
      remarkPlugins: [remarkArticleImages]
    })
  },
  redirects: {
    "/2018/12/critique-radical-markets": "/posts/2018/critique-radical-markets/",
    "/2018/12/radical-markets": "/posts/2018/radical-markets/"
  },
  site: SITE.website,
  trailingSlash: "always",
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"]
    },
    plugins: [tailwindcss()]
  }
});
