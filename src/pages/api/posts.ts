import { getCollection } from "astro:content";
import { removeQueryString } from "@astrojs/internal-helpers/path";
import type { APIRoute } from "astro";
import type { PostResponse } from "./post/[slug]";

export type PostsResponse = PostResponse[];

// XXX: we later can handle something like /api/posts?slug=foo,bar,baz but it's not feasible yet because we're doing SSG

export const GET: APIRoute = async () => {
  const posts = await getCollection("post");
  const altTexts = await getCollection("altText");

  return Response.json(
    posts.map((post) => {
      const { title, description, coverImage, publishedAt, updatedAt } = post.data;

      const coverImageFileName = coverImage
        ? removeQueryString(coverImage.src).split("/").pop()
        : undefined;

      const coverImageAlt = altTexts.find(
        ({ id }) => id === coverImageFileName?.split(".")[0],
      )?.data;

      if (coverImage && !coverImageAlt)
        throw new Error(`No alt text found for cover image: ${coverImageFileName}`);

      return {
        id: post.id,
        data: {
          title,
          description,
          publishedAt: publishedAt.toISOString(),
          ...(updatedAt && {
            updatedAt: updatedAt.toISOString(),
          }),
          ...(coverImage &&
            coverImageAlt && {
              coverImage: {
                src: coverImage.src,
                alt: coverImageAlt,
              },
            }),
        },
      };
    }) satisfies PostsResponse,
  );
};
