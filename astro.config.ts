import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import typesafeRoutes from "astro-typesafe-routes";
import type { RouteId } from "astro-typesafe-routes/path";
import { defineConfig, envField } from "astro/config";
import { METADATA } from "./src/lib/metadata";

// https://astro.build/config
export default defineConfig({
  site: METADATA.site,
  prefetch: {
    defaultStrategy: import.meta.env.DEV ? "tap" : "viewport",
    // this already is the default behavior when <ClientRouter /> is used
    // however, astro requires us to specify this explicitly when we use astro:prefetch
    prefetchAll: true,
  },
  markdown: {
    shikiConfig: {
      theme: "material-theme-darker",
    },
  },
  trailingSlash: "never",
  integrations: [mdx(), sitemap(), react(), typesafeRoutes()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    // 301, by default
    "/all": "/posts",
    "/memos": "/posts",
    "/memo/[slug]": "/post/[slug]",
    "/category/[slug]": "/tag/[slug]",
    "/tag/소셜미디어": "/tag/소셜-미디어",
    "/tag/디자인시스템": "/tag/디자인-시스템",
    "/tag/디지털권리": "/tag/디지털-권리",
    "/tag/AppsScript": "/tag/Apps-Script",
    "/tag/UX라이팅": "/tag/UX-라이팅",
  } satisfies Record<string, RouteId | (string & {})>,
  env: {
    schema: {
      DEV_ONLY_CONTENTS_PATH: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
    },
  },
});
