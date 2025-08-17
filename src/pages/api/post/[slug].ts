import { removeQueryString } from "@astrojs/internal-helpers/path";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";

interface PostResponse {
  id: string;
  data: {
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    coverImage?: {
      src: string;
      alt: string;
    };
  };
}

export const getStaticPaths = (async () => {
  const posts = await getCollection("post");

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async ({ props }) => {
  const altTexts = await getCollection("altText");

  const { post } = props as Props;
  const { title, description, coverImage, publishedAt, updatedAt } = post.data;

  const coverImageFileName = coverImage
    ? removeQueryString(coverImage.src).split("/").pop()
    : undefined;

  const coverImageAlt = altTexts.find(({ id }) => id === coverImageFileName?.split(".")[0])?.data;

  if (coverImage && !coverImageAlt)
    throw new Error(`No alt text found for cover image: ${coverImageFileName}`);

  return Response.json({
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
  } satisfies PostResponse);
};
