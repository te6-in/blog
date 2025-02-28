import { defineConfig, envField } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
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
  integrations: [mdx()],
});
