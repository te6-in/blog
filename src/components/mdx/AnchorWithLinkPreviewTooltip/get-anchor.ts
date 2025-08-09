import type { InferEntrySchema } from "astro:content";
import { getEntry } from "astro:content";

export async function getAnchor({
  href,
  astroUrl,
  options,
}: {
  href: string | URL;
  astroUrl: URL;
  options?: {
    noRef?: boolean;
  };
}): Promise<
  { url: URL } & (
    | { type: "external" | "hash"; detail?: never }
    | { type: "post"; detail: InferEntrySchema<"post"> }
    | { type: "snippet"; detail: InferEntrySchema<"snippet"> }
  )
> {
  if (typeof href === "string" && href.startsWith("#")) {
    const url = new URL(astroUrl.pathname, astroUrl.origin);
    url.hash = href;

    return { url, type: "hash" };
  }

  const isRelative = typeof href === "string" && href.startsWith("/");
  const url = new URL(href, isRelative ? astroUrl.origin : undefined);

  if ((!options || options.noRef !== true) && url.origin !== astroUrl.origin) {
    url.searchParams.set("ref", astroUrl.hostname);

    return { url, type: "external" };
  }

  const [_, type, slug] = url.pathname.split("/");

  if (type !== "post" && type !== "snippet") return { url, type: "external" };

  const entry = await getEntry(type, slug);
  if (!entry) return { url, type: "external" };

  switch (type) {
    case "post": {
      if (entry.collection !== "post") throw new Error("Invalid entry type");

      return { url, type, detail: entry.data };
    }
    case "snippet": {
      if (entry.collection !== "snippet") throw new Error("Invalid entry type");

      return { url, type, detail: entry.data };
    }
  }
}
