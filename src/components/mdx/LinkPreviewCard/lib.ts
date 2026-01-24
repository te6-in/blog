import { makeSafeGetter } from "@astro-community/astro-embed-utils";
import { type Element, getAttribute, getTextContent, isElementNode, query } from "@parse5/tools";
import { parse } from "parse5";

/**
 * Fetch a URL and parse it as HTML, but catch errors to stop builds erroring.
 * @param url URL to fetch
 * @see https://github.com/delucis/astro-embed/blob/2a5599ef98f6ef9794c1b60a1759191c73224a9d/packages/astro-embed-link-preview/dom.ts
 */
const safeGetDOM = makeSafeGetter(async (res) => {
  const document = parse(await res.text());

  return {
    getElement: (element: string, attributes: Record<string, string> = {}) => {
      const attrs = Object.entries(attributes);
      const el = query(
        document,
        (node) =>
          isElementNode(node) &&
          node.tagName === element &&
          attrs.every(([name, value]) =>
            node.attrs.some((attr) => attr.name === name && attr.value === value),
          ),
      ) as Element | null;
      return el
        ? {
            getAttribute: (name: string) => getAttribute(el, name),
            getTextContent: () => getTextContent(el),
          }
        : null;
    },
  };
});

/** Helper to filter out insecure or non-absolute URLs. */
const urlOrNull = (url: string | null | undefined) =>
  url?.slice(0, 8) === "https://" ? url : null;

/**
 * Loads and parses an HTML page to return Open Graph metadata.
 * @param pageUrl URL to parse
 * @see https://github.com/delucis/astro-embed/blob/2a5599ef98f6ef9794c1b60a1759191c73224a9d/packages/astro-embed-link-preview/lib.ts
 */
export async function parseOpenGraph(pageUrl: string) {
  const html = await safeGetDOM(pageUrl);
  if (!html) return;

  const getMetaProperty = (property: string) =>
    html.getElement("meta", { property })?.getAttribute("content");
  const getMetaName = (name: string) => html.getElement("meta", { name })?.getAttribute("content");

  const title = getMetaProperty("og:title") || html.getElement("title")?.getTextContent();
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
        html.getElement("link", { rel: "canonical" })?.getAttribute("href"),
    ) || pageUrl;

  const siteName = getMetaProperty("og:site_name");

  return { title, description, image, imageAlt, url, siteName };
}
