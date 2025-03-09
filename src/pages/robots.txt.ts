import type { APIRoute } from "astro";

// const getRobotsTxt = (sitemapURL: URL) =>
//   `
// User-agent: *
// Allow: /

// User-agent: *
// Disallow: /images

// Sitemap: ${sitemapURL.href}
// `.trimStart();

const getRobotsTxt = (sitemapURL: URL) =>
  `
User-agent: *
Disallow: /

Sitemap: ${sitemapURL.href}
`.trimStart();

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);

  return new Response(getRobotsTxt(sitemapURL));
};
