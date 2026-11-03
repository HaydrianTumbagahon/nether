import { useState } from "react";
import { searchSynonyms, searchTypeIntents } from "../config/searchSynonyms";
import {
  normalizeSearchText,
  prepareSearchEntries,
  rankSearchEntries,
  type SearchEntry,
} from "../lib/searchScoring";

interface ArchivePost {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  date: string;
  tags: string[];
  body: string;
}

interface Props {
  posts: ArchivePost[];
}

export default function ArchiveFilters({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [searchEntries] = useState(() => prepareSearchEntries(posts.map((post): SearchEntry => ({
    id: `article-${post.slug}`,
    type: "article",
    title: post.title,
    subtitle: post.categoryLabel,
    url: `/blog/${post.slug}/`,
    body: `${post.description} ${post.body}`,
    tags: ["article", "post", post.category, post.categoryLabel, ...post.tags],
    specs: [],
  }))));
  const queryLength = normalizeSearchText(query).replace(/\s/g, "").length;
  const matchingSlugs = queryLength >= 2
    ? new Set(rankSearchEntries(
        searchEntries,
        query,
        searchSynonyms,
        searchTypeIntents,
        posts.length,
      ).map(({ entry }) => entry.id.replace(/^article-/, "")))
    : undefined;
  const visiblePosts = matchingSlugs
    ? posts.filter((post) => matchingSlugs.has(post.slug))
    : posts;

  return (
    <div className="post-archive-search">
      <label className="post-archive-search-field">
        <span className="sr-only">Search posts</span>
        <input
          aria-label="Search posts"
          autoComplete="off"
          className="search-input"
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search posts"
          type="search"
          value={query}
        />
      </label>
      <div aria-live="polite" className="post-archive-results">
        {visiblePosts.length > 0 ? (
          <ol className="archive-post-list">
            {visiblePosts.map((post) => (
            <li className="archive-post-row" key={post.slug}>
              <article>
                <div className="archive-post-meta">
                  <span>{post.categoryLabel}</span>
                  <time>{post.date}</time>
                </div>
                <h2>
                  <a href={`/blog/${post.slug}/`}>{post.title}</a>
                </h2>
                <p>{post.description}</p>
              </article>
            </li>
            ))}
          </ol>
        ) : (
          <p className="empty-lane">No posts found</p>
        )}
      </div>
    </div>
  );
}
