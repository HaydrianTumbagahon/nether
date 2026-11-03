import type { APIRoute } from "astro";
import { getPublishedPosts } from "../lib/posts";
import { buildSearchEntries } from "../lib/searchIndex";

export const GET: APIRoute = async () => {
  const entries = buildSearchEntries(await getPublishedPosts());

  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};