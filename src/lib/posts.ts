import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type PostCategory = Post["data"]["category"];

export function getPostSlug(post: Pick<Post, "id">): string {
  return (post.id.split("/").at(-1) ?? post.id)
    .replace(/\.mdx?$/i, "")
    .toLowerCase();
}

export function getTagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getSitePosts(): Promise<Post[]> {
  const posts = await getCollection("posts");

  return posts
    .filter((post) => !post.data.draft || getPostSlug(post).startsWith("test-"))
    .sort(
      (first, second) =>
        second.data.pubDate.getTime() - first.data.pubDate.getTime(),
    );
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");

  return posts
    .filter((post) => !post.data.draft)
    .sort(
      (first, second) =>
        second.data.pubDate.getTime() - first.data.pubDate.getTime(),
    );
}

export async function getPostsByCategory(
  category: PostCategory,
  posts?: Post[],
): Promise<Post[]> {
  const entries = posts ?? (await getPublishedPosts());
  return entries.filter((post) => post.data.category === category);
}

export async function getRelatedPosts(
  post: Post,
  limit = 3,
  posts?: Post[],
): Promise<Post[]> {
  const tags = new Set(post.data.tags.map((tag) => tag.toLowerCase()));
  const entries = posts ?? (await getPublishedPosts());

  return entries
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const sharedTags = candidate.data.tags.filter((tag) =>
        tags.has(tag.toLowerCase()),
      ).length;
      const sameCategory = candidate.data.category === post.data.category;

      return { candidate, score: sharedTags + Number(sameCategory) };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        second.candidate.data.pubDate.getTime() -
          first.candidate.data.pubDate.getTime(),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export async function getAllTags(
  posts?: Post[],
): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();

  for (const post of posts ?? (await getPublishedPosts())) {
    for (const tag of new Set(post.data.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort(
      (first, second) =>
        second.count - first.count || first.tag.localeCompare(second.tag),
    );
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
