import { getCollection } from "astro:content";
import { uniqBy } from "es-toolkit";
import { slug } from "github-slugger";

export async function getTags() {
  const posts = await getCollection("post");
  const snippets = await getCollection("snippet");

  const tags = [
    ...posts.flatMap((post) => post.data.tags),
    ...snippets.flatMap((snippet) => snippet.data.tags),
  ];

  const tagsWithSlugs = tags.map((tag) => ({ name: tag, slug: slug(tag) }));

  const uniqueTagsWithSlugs = uniqBy(tagsWithSlugs, ({ slug }) => slug);

  const sortedTagsWithSlugs = uniqueTagsWithSlugs.sort((a, b) => a.name.localeCompare(b.name));

  return sortedTagsWithSlugs;
}
