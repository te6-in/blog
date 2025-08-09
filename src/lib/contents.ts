import { type CollectionEntry, getCollection } from "astro:content";
import { $path } from "astro-typesafe-routes/path";
import { uniqBy } from "es-toolkit";
import { slug } from "github-slugger";

export async function getTag(name: string) {
  const posts = await getCollection("post");
  const snippets = await getCollection("snippet");
  const tagsFound = [
    ...posts.flatMap((post) => post.data.tags),
    ...snippets.flatMap((snippet) => snippet.data.tags),
  ];

  const tag = tagsFound.find((tag) => name === tag);
  if (!tag) throw new Error(`Tag not found: ${name}`);

  const tagSlug = slug(tag);
  const tagCount = tagsFound.filter((t) => t === tag).length;

  return {
    name: tag,
    slug: tagSlug,
    count: tagCount,
  };
}

interface GetTagsParams {
  sortBy?: "name" | "count";
}

export async function getTags({ sortBy = "name" }: GetTagsParams) {
  const posts = await getCollection("post");
  const snippets = await getCollection("snippet");

  const tagsFound = [
    ...posts.flatMap((post) => post.data.tags),
    ...snippets.flatMap((snippet) => snippet.data.tags),
  ];

  const tags = tagsFound.map((tag) => ({
    name: tag,
    slug: slug(tag),
    count: tagsFound.filter((t) => t === tag).length,
  }));

  const uniqueTags = uniqBy(tags, ({ slug }) => slug);

  const sortedTags = uniqueTags.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "count": {
        if (a.count === b.count) return a.name.localeCompare(b.name);

        return b.count - a.count;
      }
    }
  });

  return sortedTags;
}

interface GetPostsParams {
  sortBy?: "publishedAt";
}

export async function getPosts({ sortBy = "publishedAt" }: GetPostsParams) {
  const posts = await getCollection("post");

  const sortedPosts = posts.sort((a, b) => {
    switch (sortBy) {
      // biome-ignore lint/complexity/noUselessSwitchCase: will be extended in the future
      case "publishedAt":
      default:
        return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    }
  });

  return sortedPosts;
}

interface GetSnippetsParams {
  sortBy?: "publishedAt";
}

export async function getSnippets({ sortBy = "publishedAt" }: GetSnippetsParams) {
  const snippets = await getCollection("snippet");

  const sortedSnippets = snippets.sort((a, b) => {
    switch (sortBy) {
      // biome-ignore lint/complexity/noUselessSwitchCase: will be extended in the future
      case "publishedAt":
      default:
        return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    }
  });

  return sortedSnippets;
}

export function getPostUrl({ id }: CollectionEntry<"post">, astroUrl: URL) {
  return new URL($path({ to: "/post/[slug]", params: { slug: id } }), astroUrl.origin);
}

export function getSnippetUrl({ id }: CollectionEntry<"snippet">, astroUrl: URL) {
  return new URL($path({ to: "/snippet/[slug]", params: { slug: id } }), astroUrl.origin);
}
