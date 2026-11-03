import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { searchSynonyms, searchTypeIntents } from "../config/searchSynonyms";
import {
  getHighlightRanges,
  normalizeSearchText,
  prepareSearchEntries,
  rankSearchEntries,
  type PreparedSearchEntry,
  type SearchEntry,
  type SearchItemType,
  type SearchResult,
} from "../lib/searchScoring";

interface Props {
  initialQuery?: string;
  embedded?: boolean;
}

const overlayResultLimit = 8;
const resultTypeOrder: SearchItemType[] = [
  "keyboard",
  "mouse",
  "iem",
  "article",
  "page",
];
const resultTypeLabels: Record<SearchItemType, string> = {
  keyboard: "Keyboards",
  mouse: "Mice",
  iem: "IEMs",
  article: "Articles",
  page: "Pages",
};
const categorySuggestions = [
  {
    id: "suggest-keyboards",
    type: "page" as const,
    title: "Keyboards",
    subtitle: "Browse gear",
    url: "/keyboards/",
    body: "Browse keyboard gear",
    tags: ["keyboard"],
    specs: [],
  },
  {
    id: "suggest-mice",
    type: "page" as const,
    title: "Mice",
    subtitle: "Browse gear",
    url: "/mice/",
    body: "Browse mouse gear",
    tags: ["mouse"],
    specs: [],
  },
  {
    id: "suggest-iems",
    type: "page" as const,
    title: "IEMs",
    subtitle: "Browse gear",
    url: "/iems/",
    body: "Browse in-ear monitor gear",
    tags: ["iem"],
    specs: [],
  },
  {
    id: "suggest-web-development",
    type: "page" as const,
    title: "Web Development",
    subtitle: "Browse articles",
    url: "/category/web-development/",
    body: "Browse web development articles",
    tags: ["article"],
    specs: [],
  },
];
const noResultSuggestions = ["mechanical keyboard", "wireless mouse", "bassy IEMs"].map(
  (suggestion, index) => ({
    entry: {
      id: `suggest-query-${index}`,
      type: "page" as const,
      title: `Search for "${suggestion}"`,
      subtitle: "Suggested search",
      url: `/search/?q=${encodeURIComponent(suggestion)}`,
      body: suggestion,
      tags: [],
      specs: [],
    },
    score: 0,
    snippet: suggestion,
  }),
);

let searchIndexPromise: Promise<PreparedSearchEntry[]> | undefined;

async function loadSearchIndex(): Promise<PreparedSearchEntry[]> {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch("/search-index.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Search index request failed.");
        return (await response.json()) as SearchEntry[];
      })
      .then(prepareSearchEntries)
      .catch((error: unknown) => {
        searchIndexPromise = undefined;
        throw error;
      });
  }

  return searchIndexPromise;
}

function updateSearchUrl(query: string) {
  const url = new URL(window.location.href);
  if (query.trim()) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function renderHighlightedText(text: string, query: string): ReactNode {
  const ranges = getHighlightRanges(text, query, searchSynonyms);
  if (ranges.length === 0) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([start, end], index) => {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(<mark key={`${start}-${index}`}>{text.slice(start, end)}</mark>);
    cursor = end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function SearchResultList({
  results,
  query,
  activeIndex,
  resultIdPrefix,
  listboxId,
  onHover,
  label,
  emptyMessage,
}: {
  results: SearchResult[];
  query: string;
  activeIndex: number;
  resultIdPrefix: string;
  listboxId: string;
  onHover: (index: number) => void;
  label: string;
  emptyMessage?: string;
}) {
  return (
    <div
      aria-label={label}
      className="search-results"
      id={listboxId}
      role="listbox"
    >
      {emptyMessage && <p className="search-results-state">{emptyMessage}</p>}
      {resultTypeOrder.map((type) => {
        const group = results
          .map((result, resultIndex) => ({ result, resultIndex }))
          .filter(({ result }) => result.entry.type === type);
        if (group.length === 0) return null;

        return (
          <section
            aria-label={resultTypeLabels[type]}
            className="search-result-group"
            key={type}
            role="group"
          >
            <h2 className="search-result-group-title">{resultTypeLabels[type]}</h2>
            <ul className="search-results-list">
              {group.map(({ result, resultIndex }) => (
                <li key={result.entry.id}>
                  <a
                    aria-selected={activeIndex === resultIndex}
                    className="search-result"
                    href={result.entry.url}
                    id={`${resultIdPrefix}-${resultIndex}`}
                    onMouseEnter={() => onHover(resultIndex)}
                    role="option"
                  >
                    <span aria-hidden={!result.entry.image} className="search-result-thumbnail-slot">
                      {result.entry.image ? (
                        <img
                          alt={result.entry.imageAlt ?? ""}
                          className="search-result-thumbnail"
                          decoding="async"
                          height="48"
                          loading="lazy"
                          src={result.entry.image}
                          width="48"
                        />
                      ) : (
                        <span className="search-result-thumbnail-placeholder" />
                      )}
                    </span>
                    <span className="search-result-copy">
                      <span className="search-result-meta">
                        {result.entry.subtitle || resultTypeLabels[type]}
                      </span>
                      <strong>
                        {renderHighlightedText(result.entry.title, query)}
                      </strong>
                      <span className="search-result-excerpt">
                        {renderHighlightedText(result.snippet, query)}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function SearchIsland({
  initialQuery = "",
  embedded = false,
}: Props) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const inputId = `${embedded ? "page" : "dialog"}-search-input-${instanceId}`;
  const listboxId = `${instanceId}-search-results`;
  const resultIdPrefix = `${instanceId}-search-result`;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery.slice(0, 300));
  const [preparedEntries, setPreparedEntries] = useState<PreparedSearchEntry[] | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexUnavailable, setIndexUnavailable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const normalizedQuery = normalizeSearchText(query);
  const normalizedQueryLength = normalizedQuery.replace(/\s/g, "").length;
  const hasSearchQuery = normalizedQueryLength >= 2;
  const isShortQuery = Boolean(query.trim()) && !hasSearchQuery;
  const visibleResults = embedded ? results : results.slice(0, overlayResultLimit);
  const suggestedGear = preparedEntries
    ?.filter(({ entry }) => entry.type === "keyboard" || entry.type === "mouse" || entry.type === "iem")
    .sort((first, second) => (second.entry.rating ?? 0) - (first.entry.rating ?? 0))
    .slice(0, 3)
    .map(({ entry }) => ({
      entry,
      score: entry.rating ?? 0,
      snippet: entry.body.slice(0, 150),
    })) ?? [];
  const defaultSuggestions = [
    ...categorySuggestions.map((entry) => ({ entry, score: 0, snippet: entry.body })),
    ...suggestedGear,
  ];
  const activeResults = hasSearchQuery
    ? visibleResults
    : isShortQuery
      ? []
      : query.trim()
        ? noResultSuggestions
        : defaultSuggestions;
  const noMatches = hasSearchQuery && !searching && !indexUnavailable && results.length === 0;
  const resultsMessage = indexUnavailable
    ? "Site search is temporarily unavailable. Please try again later."
    : indexLoading && !preparedEntries
      ? "Loading site content..."
      : isShortQuery
        ? "Keep typing to search."
        : hasSearchQuery && searching && results.length === 0
          ? "Searching..."
          : noMatches
            ? "No results. Try one of these searches:"
            : !query.trim() && !preparedEntries
              ? "Loading suggestions..."
              : undefined;
  const showSeeAll = !embedded && hasSearchQuery && results.length > overlayResultLimit;

  function openDialog(opener?: HTMLElement | null) {
    openerRef.current =
      opener ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  function updateQuery(nextQuery: string) {
    const limitedQuery = nextQuery.slice(0, 300);
    setQuery(limitedQuery);
    setActiveIndex(0);
    if (embedded) updateSearchUrl(limitedQuery);
  }

  useEffect(() => {
    if (embedded) return;

    function handleShortcut(event: KeyboardEvent) {
      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      const isCommandShortcut =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      const isSlashShortcut = event.key === "/" && !isEditing;

      if (isCommandShortcut || isSlashShortcut) {
        event.preventDefault();
        if (!dialogOpen) openDialog();
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [dialogOpen, embedded]);

  useEffect(() => {
    if (embedded) return;
    if (!dialogOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (openerRef.current?.isConnected) {
        openerRef.current.focus({ preventScroll: true });
      }
      openerRef.current = null;
    };
  }, [dialogOpen, embedded]);

  useEffect(() => {
    if (!embedded && !dialogOpen) return;
    if (preparedEntries) return;

    let active = true;
    setIndexLoading(true);
    setIndexUnavailable(false);
    void loadSearchIndex()
      .then((entries) => {
        if (active) setPreparedEntries(entries);
      })
      .catch(() => {
        if (active) setIndexUnavailable(true);
      })
      .finally(() => {
        if (active) setIndexLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dialogOpen, embedded, preparedEntries]);

  useEffect(() => {
    if (!hasSearchQuery || !preparedEntries) {
      setSearching(false);
      return;
    }

    let active = true;
    setSearching(true);
    const timeout = window.setTimeout(async () => {
      try {
        const ranked = rankSearchEntries(
          preparedEntries,
          query,
          searchSynonyms,
          searchTypeIntents,
          1000,
        );
        if (!active) return;
        setResults(ranked);
        setActiveIndex(0);
      } catch {
        if (!active) return;
        setResults([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 100);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [hasSearchQuery, preparedEntries, query]);

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && !embedded) {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key === "ArrowDown" && activeResults.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % activeResults.length);
    } else if (event.key === "ArrowUp" && activeResults.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + activeResults.length) % activeResults.length);
    } else if (event.key === "Enter" && activeResults[activeIndex]) {
      event.preventDefault();
      document.getElementById(`${resultIdPrefix}-${activeIndex}`)?.click();
    }
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const panel = (
    <div className="search-panel" ref={panelRef}>
      <div className="search-panel-heading">
        <label htmlFor={inputId}>Search the site</label>
        {!embedded && (
          <button
            aria-label="Close search"
            className="search-close"
            onClick={closeDialog}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      <input
        aria-activedescendant={
          activeResults[activeIndex]
            ? `${resultIdPrefix}-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={activeResults.length > 0}
        aria-label="Search Nether content"
        autoComplete="off"
        className="search-input"
        id={inputId}
        maxLength={300}
        onChange={(event) => {
          updateQuery(event.currentTarget.value);
        }}
        onKeyDown={handleInputKeyDown}
        ref={inputRef}
        role="combobox"
        type="search"
        value={query}
      />

      <p aria-live="polite" className="search-status" role="status">
        {indexUnavailable
          ? "Site search is temporarily unavailable. Please try again later."
          : indexLoading
            ? "Loading site content..."
            : searching
              ? "Searching..."
              : !query.trim()
                ? "Search gear, articles, and site pages."
                : normalizedQueryLength < 2
                  ? "Type at least two characters to search."
                  : searching
                    ? "Searching..."
                    : `${results.length} ${results.length === 1 ? "result" : "results"}.`}
      </p>

      <SearchResultList
        activeIndex={activeIndex}
        emptyMessage={resultsMessage}
        label={query.trim() ? "Search results and suggestions" : "Quick search suggestions"}
        listboxId={listboxId}
        onHover={setActiveIndex}
        query={query}
        resultIdPrefix={resultIdPrefix}
        results={activeResults}
      />
      {!embedded && (
        <div className="search-panel-footer">
          <a
            aria-hidden={!showSeeAll}
            className="search-see-all"
            href={`/search/?q=${encodeURIComponent(query)}`}
            tabIndex={showSeeAll ? 0 : -1}
          >
            {showSeeAll ? `See all ${results.length} results` : ""}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      {!embedded && (
        <button
          aria-haspopup="dialog"
          aria-label="Search the site"
          className="search-open-trigger"
          onClick={(event) => openDialog(event.currentTarget)}
          title="Search the site"
          type="button"
        >
          <svg aria-hidden="true" height="20" viewBox="0 0 24 24" width="20">
            <circle
              cx="10.8"
              cy="10.8"
              r="6.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="m16 16 4.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        </button>
      )}
      {embedded ? (
        <div className="search-page-island">{panel}</div>
      ) : dialogOpen ? (
        <div
          data-lenis-prevent
          className="search-dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            aria-label="Search the site"
            aria-modal="true"
            className="search-dialog"
            onKeyDown={trapFocus}
            role="dialog"
          >
            {panel}
          </section>
        </div>
      ) : null}
    </>
  );
}
