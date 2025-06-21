import { getCollection } from "astro:content";
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
