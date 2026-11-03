export type SearchItemType = "keyboard" | "mouse" | "iem" | "article" | "page";

export interface SearchEntry {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  url: string;
  body: string;
  tags: string[];
  specs: string[];
  rating?: number;
  image?: string;
  imageAlt?: string;
}

export interface PreparedSearchEntry {
  entry: SearchEntry;
  fields: {
    weight: number;
    text: string;
    tokens: { value: string; start: number; end: number }[];
  }[];
}

export interface SearchResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

type SearchSynonyms = Record<string, readonly string[]>;
type SearchIntents = Record<string, string>;
type QueryGroup = { terms: string[]; allowPrefix: boolean };

const tokenPattern = /[\p{L}\p{N}]+/gu;

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\p{M}]/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function stemToken(token: string): string {
  if (token === "mice") return "mouse";
  if (token.endsWith("ies") && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }
  if (/(ches|shes|sses|xes|zes)$/.test(token) && token.length > 4) {
    return token.slice(0, -2);
  }
  if (token.endsWith("s") && token.length > 3 && !/(ss|us|is)$/.test(token)) {
    return token.slice(0, -1);
  }
  return token;
}

function words(value: string): string[] {
  return normalizeSearchText(value)
    .split(" ")
    .filter(Boolean)
    .map(stemToken);
}

function tokenizeWithOffsets(value: string) {
  return [...value.matchAll(tokenPattern)].map((match) => ({
    value: stemToken(normalizeSearchText(match[0])),
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  }));
}

export function prepareSearchEntries(entries: SearchEntry[]): PreparedSearchEntry[] {
  return entries.map((entry) => ({
    entry,
    fields: [
      { text: entry.title, weight: 150 },
      { text: entry.subtitle, weight: 135 },
      { text: entry.tags.join(" "), weight: 95 },
      { text: entry.specs.join(" "), weight: 65 },
      { text: entry.body, weight: 30 },
    ].map((field) => ({
      ...field,
      tokens: tokenizeWithOffsets(field.text),
    })),
  }));
}

function groupForToken(
  token: string,
  synonyms: SearchSynonyms,
  allowPrefix: boolean,
): QueryGroup {
  const normalizedToken = stemToken(token);
  const alias = Object.entries(synonyms).find(
    ([name]) => normalizeSearchText(name) === normalizedToken,
  );
  const alternatives = alias?.[1].flatMap(words) ?? [];
  return {
    terms: [...new Set([normalizedToken, ...alternatives])],
    allowPrefix,
  };
}

function createQueryGroups(query: string, synonyms: SearchSynonyms): QueryGroup[] {
  const queryTokens = normalizeSearchText(query).split(" ").filter(Boolean);
  const phrases = Object.entries(synonyms)
    .map(([phrase, replacements]) => ({
      tokens: normalizeSearchText(phrase).split(" ").filter(Boolean),
      replacements,
    }))
    .filter((phrase) => phrase.tokens.length > 1)
    .sort((first, second) => second.tokens.length - first.tokens.length);
  const groups: QueryGroup[] = [];

  for (let tokenIndex = 0; tokenIndex < queryTokens.length;) {
    const phrase = phrases.find((candidate) =>
      candidate.tokens.every(
        (token, phraseIndex) => queryTokens[tokenIndex + phraseIndex] === token,
      ),
    );

    if (phrase) {
      const replacementTerms = phrase.replacements.flatMap(words);
      const phraseEnd = tokenIndex + phrase.tokens.length;
      const allowPrefix = phraseEnd === queryTokens.length;
      if (replacementTerms.length === 1) {
        groups.push({
          terms: [...new Set(replacementTerms)],
          allowPrefix,
        });
      } else {
        phrase.tokens.forEach((token, phraseIndex) => {
          groups.push(
            groupForToken(token, synonyms, allowPrefix && phraseIndex === phrase.tokens.length - 1),
          );
        });
      }
      tokenIndex = phraseEnd;
      continue;
    }

    groups.push(
      groupForToken(
        queryTokens[tokenIndex],
        synonyms,
        tokenIndex === queryTokens.length - 1,
      ),
    );
    tokenIndex += 1;
  }

  return groups;
}

function withinOneEdit(searchTerm: string, indexedTerm: string): boolean {
  if (Math.abs(searchTerm.length - indexedTerm.length) > 1) return false;

  let searchIndex = 0;
  let indexedIndex = 0;
  let edits = 0;

  while (searchIndex < searchTerm.length && indexedIndex < indexedTerm.length) {
    if (searchTerm[searchIndex] === indexedTerm[indexedIndex]) {
      searchIndex += 1;
      indexedIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;
    if (searchTerm.length > indexedTerm.length) searchIndex += 1;
    else if (indexedTerm.length > searchTerm.length) indexedIndex += 1;
    else {
      searchIndex += 1;
      indexedIndex += 1;
    }
  }

  if (searchIndex < searchTerm.length || indexedIndex < indexedTerm.length) {
    edits += 1;
  }
  return edits <= 1;
}

function tokenMatchScore(
  queryGroup: QueryGroup,
  indexedToken: string,
  fieldWeight: number,
): number {
  if (queryGroup.terms.includes(indexedToken)) return fieldWeight;

  for (const term of queryGroup.terms) {
    if (queryGroup.allowPrefix && term.length >= 2 && indexedToken.startsWith(term)) {
      return fieldWeight * 0.88;
    }
    if (term.length >= 4 && withinOneEdit(term, indexedToken)) {
      return fieldWeight * 0.62;
    }
  }

  return 0;
}

function groupScore(group: QueryGroup, entry: PreparedSearchEntry): number {
  let bestScore = 0;
  for (const field of entry.fields) {
    for (const token of field.tokens) {
      bestScore = Math.max(
        bestScore,
        tokenMatchScore(group, token.value, field.weight),
      );
    }
  }
  return bestScore;
}

function queryIntents(query: string, intents: SearchIntents): Set<string> {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = new Set(normalizedQuery.split(" ").map(stemToken));
  const matched = new Set<string>();

  for (const [term, type] of Object.entries(intents)) {
    const normalizedTerm = normalizeSearchText(term);
    if (
      normalizedTerm.includes(" ")
        ? ` ${normalizedQuery} `.includes(` ${normalizedTerm} `)
        : queryTokens.has(stemToken(normalizedTerm))
    ) {
      matched.add(type);
    }
  }

  return matched;
}

function rankBonus(entry: SearchEntry, normalizedQuery: string, intents: Set<string>): number {
  const normalizedTitle = normalizeSearchText(entry.title);
  const normalizedSubtitle = normalizeSearchText(entry.subtitle);
  let bonus = 0;

  if (normalizedTitle === normalizedQuery) bonus += 240;
  else if (normalizedTitle.startsWith(normalizedQuery)) bonus += 110;
  if (normalizedSubtitle === normalizedQuery) bonus += 220;
  else if (normalizedSubtitle.startsWith(normalizedQuery)) bonus += 95;
  if (intents.has(entry.type)) bonus += 70;

  return bonus;
}

function tokenMatchesGroup(token: string, group: QueryGroup): boolean {
  return group.terms.some(
    (term) =>
      token === term ||
      (group.allowPrefix && term.length >= 2 && token.startsWith(term)) ||
      (term.length >= 4 && withinOneEdit(term, token)),
  );
}

function makeSnippet(entry: PreparedSearchEntry, groups: QueryGroup[]): string {
  const bodyField = entry.fields.find((field) => field.text === entry.entry.body);
  const body = bodyField?.text.trim() ?? "";
  if (!body) return entry.entry.subtitle || entry.entry.title;

  const matchingToken = bodyField?.tokens.find((token) =>
    groups.some((group) => tokenMatchesGroup(token.value, group)),
  );
  if (!matchingToken) return body.slice(0, 150);

  let start = Math.max(0, matchingToken.start - 54);
  let end = Math.min(body.length, start + 154);
  while (start > 0 && !/\s/.test(body[start - 1])) start -= 1;
  while (end < body.length && !/\s/.test(body[end])) end += 1;
  return `${start > 0 ? "..." : ""}${body.slice(start, end).trim()}${end < body.length ? "..." : ""}`;
}

export function rankSearchEntries(
  entries: PreparedSearchEntry[],
  query: string,
  synonyms: SearchSynonyms,
  intents: SearchIntents,
  limit = 50,
): SearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.replace(/\s/g, "").length < 2) return [];

  const groups = createQueryGroups(query, synonyms);
  const matchedIntents = queryIntents(query, intents);

  return entries
    .map((preparedEntry) => {
      const scores = groups.map((group) => groupScore(group, preparedEntry));
      if (scores.some((score) => score === 0)) return undefined;

      const score =
        scores.reduce((total, current) => total + current, 0) +
        rankBonus(preparedEntry.entry, normalizedQuery, matchedIntents);
      return {
        entry: preparedEntry.entry,
        score,
        snippet: makeSnippet(preparedEntry, groups),
      };
    })
    .filter((result): result is SearchResult => result !== undefined)
    .sort(
      (first, second) =>
        second.score - first.score ||
        (second.entry.rating ?? -1) - (first.entry.rating ?? -1) ||
        first.entry.title.localeCompare(second.entry.title),
    )
    .slice(0, limit);
}

export function getHighlightRanges(
  text: string,
  query: string,
  synonyms: SearchSynonyms,
): [number, number][] {
  const groups = createQueryGroups(query, synonyms);
  const ranges = tokenizeWithOffsets(text)
    .filter((token) => groups.some((group) => tokenMatchesGroup(token.value, group)))
    .map((token): [number, number] => [token.start, token.end]);

  if (ranges.length < 2) return ranges;

  return ranges.reduce<[number, number][]>((merged, range) => {
    const previous = merged.at(-1);
    if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
    else merged.push(range);
    return merged;
  }, []);
}