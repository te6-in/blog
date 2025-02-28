import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.te6.in",
  integrations: [mdx(), sitemap()],
  redirects: {
    // 301, by default
    "/all": "/posts",
    "/memos": "/posts",
    "/memo/[slug]": "/post/[slug]",
    "/category/[slug]": "/tag/[slug]",
  },
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
