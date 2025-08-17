import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";

export interface SnippetResponse {
  id: string;
  data: {
    title: string;
    publishedAt: string;
    updatedAt?: string;
  };
}

export const getStaticPaths = (async () => {
  const snippets = await getCollection("snippet");

  return snippets.map((snippet) => ({
    params: { slug: snippet.id },
    props: { snippet },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async ({ props }) => {
  const { snippet } = props as Props;
  const { title, publishedAt, updatedAt } = snippet.data;

  return Response.json({
    id: snippet.id,
    data: {
      title,
      publishedAt: publishedAt.toISOString(),
      ...(updatedAt && {
        updatedAt: updatedAt.toISOString(),
      }),
    },
  } satisfies SnippetResponse);
};
