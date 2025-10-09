import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { METADATA } from "../lib/metadata";

export const GET: APIRoute = async (context) => {
  if (!context.site)
    throw new Error(
      "`context.site` is not defined. Make sure you set the `site` property in your `astro.config.mjs` file.",
    );

  const posts = await getCollection("post");
  const snippets = await getCollection("snippet");

  const articles = [...posts, ...snippets].sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
  );

  return rss({
    title: METADATA.name,
    description: METADATA.description,
    site: context.site,
    trailingSlash: false,
    items: articles.map((item) => ({
      title: item.data.title,
      ...("description" in item.data && { description: item.data.description }),
      pubDate: new Date(item.data.publishedAt),
      categories: item.data.tags,
      // we don't specify author here because it's for specifying emails
      link: new URL(`${item.collection}/${item.id}`, context.site).href,
    })),
  });
};
