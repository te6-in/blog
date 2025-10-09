import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) =>
  `
User-agent: *
Disallow: /_astro/*
Disallow: /images/*

User-agent: Googlebot
Disallow: /images/*

User-agent: Bingbot
Disallow: /images/*

User-agent: Slurp
Disallow: /images/*

User-agent: DuckDuckBot
Disallow: /images/*

User-agent: Kagibot
Disallow: /images/*

User-agent: Yeti
Disallow: /images/*

User-agent: Daum
Disallow: /images/*

Sitemap: ${sitemapURL.href}
`.trimStart();

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);

  return new Response(getRobotsTxt(sitemapURL));
};
