import { join, resolve } from "node:path";
import { defineCollection, reference, z } from "astro:content";
import { DEV_ONLY_CONTENTS_PATH } from "astro:env/server";
import { file, glob } from "astro/loaders";

const contentsPath =
  import.meta.env.DEV && DEV_ONLY_CONTENTS_PATH
    ? // on development: DEV_ONLY_CONTENTS_PATH를 사용하여 로컬 contents를 사용
      join(resolve(DEV_ONLY_CONTENTS_PATH), "contents")
    : // on production: git submodule로 연결된 리모트의 contents를 사용
      join(import.meta.dirname, "../contents/contents"); // XXX

const posts = defineCollection({
  loader: glob({
    pattern: "*.mdx",
    base: join(contentsPath, "posts"),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      coverImage: image().optional(),
      tags: z.array(z.string()).optional(),
      publishedAt: z.date(),
      updatedAt: z.date().optional(),
      featured: z.boolean().optional(),
      amoo: z.boolean().optional(),
    }),
});

const snippets = defineCollection({
  loader: glob({
    pattern: "*.mdx",
    base: join(contentsPath, "snippets"),
  }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
  }),
});

const series = defineCollection({
  loader: glob({
    pattern: "*.json",
    base: join(contentsPath, "series"),
  }),
  schema: z.object({
    title: z.string(),
    posts: z
      .array(
        z.union([
          z.object({
            type: z.literal("post"),
            slug: reference("posts"),
          }),
          z.object({
            type: z.literal("snippet"),
            slug: reference("snippets"),
          }),
        ]),
      )
      .min(1),
  }),
});

const authors = defineCollection({
  loader: glob({
    pattern: "*.json",
    base: join(contentsPath, "authors"),
  }),
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    url: z.string().url().optional(),
  }),
});

const socialMedia = defineCollection({
  loader: file(join(contentsPath, "social-media.json")),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    iconSvg: z.string(),
  }),
});

const altTexts = defineCollection({
  loader: file(join(contentsPath, "alt-texts.json")),
  schema: z.string(),
});

export const collections = {
  posts,
  snippets,
  series,
  authors,
  socialMedia,
  altTexts,
};
