import type { APIRoute } from "astro";
import { site } from "../config/site";

export const GET: APIRoute = () => {
  const sitemap = new URL("/sitemap-index.xml", site.url);
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${sitemap.href}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
