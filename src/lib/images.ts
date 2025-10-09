import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import { removeQueryString } from "@astrojs/internal-helpers/path";

export async function getAlt(...getImageParams: Parameters<typeof getImage>) {
  const { src } = await getImage(...getImageParams);

  const decodedSrc = decodeURIComponent(src);

  const fileName = removeQueryString(decodedSrc).split("/").pop();

  const alt = (await getCollection("altText")).find(
    ({ id }) => id === fileName?.split(".")[0],
  )?.data;

  if (!alt) throw new Error(`Alt text not found or empty. src: ${decodedSrc}`);

  return alt;
}
