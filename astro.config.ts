import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
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
