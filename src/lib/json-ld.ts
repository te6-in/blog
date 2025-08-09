import type { CollectionEntry } from "astro:content";
import { $path } from "astro-typesafe-routes/path";
import type { BreadcrumbList, Person, WithContext } from "schema-dts";
import { getPostUrl, getSnippetUrl } from "./contents";
import { METADATA } from "./metadata";

export function getBlogAuthorPerson({ origin }: URL) {
  const url = new URL(origin);
  url.hash = "#person";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": url.href,
    name: METADATA.author.name,
    url: METADATA.author.url,
    image: METADATA.author.avatar,
  } satisfies WithContext<Person>;
}

export function getPeopleFromAuthors(
  authors: CollectionEntry<"author">[],
  astroUrl: URL,
): WithContext<Person>[] {
  const blogAuthor = getBlogAuthorPerson(astroUrl);

  return authors.map(({ data: { avatar, name, url } }) => {
    if (name === getBlogAuthorPerson(astroUrl).name)
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": blogAuthor["@id"],
      };

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      url,
      image: avatar,
    };
  });
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
        name: METADATA.lexicons.index.label,
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
