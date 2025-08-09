import type { BreadcrumbList, Person, WithContext } from "schema-dts";
import type { CollectionEntry } from "astro:content";
import { $path } from "astro-typesafe-routes/path";
import { getPostUrl, getSnippetUrl } from "./contents";

export function getPeopleFromAuthors(authors: CollectionEntry<"author">[]): WithContext<Person>[] {
  return authors.map(({ data: { avatar, name, url } }) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    image: avatar,
  }));
}

export function getBreadcrumbListsFromTags(
  tags: {
    name: string;
    slug: string;
  }[],
  astroUrl: URL,
): WithContext<BreadcrumbList>[] {
  return tags.map(({ name, slug }) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: astroUrl.origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: new URL($path({ to: "/tag/[slug]", params: { slug } }), astroUrl.origin).href,
      },
    ],
  }));
}

export function getPostBlogPostingId(post: CollectionEntry<"post">, astroUrl: URL) {
  const url = getPostUrl(post, astroUrl);

  url.hash = "#blogPosting";

  return url.href;
}

export function getSnippetBlogPostingId(snippet: CollectionEntry<"snippet">, astroUrl: URL) {
  const url = getSnippetUrl(snippet, astroUrl);

  url.hash = "#blogPosting";

  return url.href;
}
