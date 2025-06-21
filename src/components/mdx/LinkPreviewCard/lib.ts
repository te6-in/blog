import { safeGetDOM } from "@astro-community/astro-embed-utils";

/** Helper to get the `content` attribute of an element. */
const getContent = (el: Element | null) => el?.getAttribute("content");
/** Helper to filter out insecure or non-absolute URLs. */
const urlOrNull = (url: string | null | undefined) =>
  url?.slice(0, 8) === "https://" ? url : null;

/**
 * Loads and parses an HTML page to return Open Graph metadata.
 * @param pageUrl URL to parse
 */
export async function parseOpenGraph(pageUrl: string) {
  const html = await safeGetDOM(pageUrl);
  if (!html) return;

  const getMetaProperty = (prop: string) =>
    getContent(html.querySelector(`meta[property=${JSON.stringify(prop)}]`));
  const getMetaName = (name: string) =>
    getContent(html.querySelector(`meta[name=${JSON.stringify(name)}]`));

  const title = getMetaProperty("og:title") || html.querySelector("title")?.textContent;
  const description = getMetaProperty("og:description") || getMetaName("description");
  const image = urlOrNull(
    getMetaProperty("og:image:secure_url") ||
      getMetaProperty("og:image:url") ||
      getMetaProperty("og:image"),
  );
  const imageAlt = getMetaProperty("og:image:alt");
  const url =
    urlOrNull(
      getMetaProperty("og:url") ||
        html.querySelector("link[rel='canonical']")?.getAttribute("href"),
    ) || pageUrl;
  const siteName = getMetaProperty("og:site_name");

  return { title, description, image, imageAlt, url, siteName };
}
