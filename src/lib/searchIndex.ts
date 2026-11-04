import { site } from "../config/site";
import {
  getIems,
  getKeyboards,
  getMice,
} from "../data/gear";
import type { GearItem } from "../data/gear/types";
import { getPostSlug, type Post } from "./posts";
import type { SearchEntry } from "./searchScoring";

const gearRoutes = {
  keyboard: "keyboards",
  mouse: "mice",
  iem: "iems",
} as const;

const gearEditorialFields = new Set([
  "id",
  "kind",
  "brand",
  "name",
  "images",
  "links",
  "example",
  "summary",
  "good",
  "annoying",
  "insight",
  "score",
  "handsOn",
  "verdict",
  "verdictLine",
  "bestFor",
  "updated",
]);

const searchPages = [
  {
    id: "page-about",
    title: "About",
    url: "/about/",
    headings: ["What I write about", "How I cover gear", "Get in touch"],
  },
  {
    id: "page-contact",
    title: "Contact",
    url: "/contact/",
    headings: ["Ways to reach me", "Before you write"],
  },
  {
    id: "page-how-i-rate",
    title: "How I rate gear",
    url: "/gear/how-i-rate/",
    headings: ["Keyboards", "Mice", "IEMs", "How I test", "What the score means"],
  },
  {
    id: "page-disclosure",
    title: "Disclosure",
    url: "/disclosure/",
    headings: [
      "Store links and commissions",
      "Ratings and editorial independence",
      "Images and measurements",
      "AI-assisted work",
    ],
  },
  {
    id: "page-privacy",
    title: "Privacy",
    url: "/privacy/",
    headings: [
      "Information this site uses",
      "Browser storage",
      "Contact messages",
      "Links to other sites",
      "Your choices and privacy requests",
      "Changes to this policy",
    ],
  },
  {
    id: "page-terms",
    title: "Terms",
    url: "/terms/",
    headings: [
      "Using Nether",
      "Content and other people's work",
      "Information and opinions",
      "External links and purchases",
      "Availability and responsibility",
      "Changes and contact",
    ],
  },
];

function flattenValue(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }
  if (Array.isArray(value)) return value.flatMap(flattenValue);
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) => [
      key,
      ...flattenValue(nestedValue),
    ]);
  }
  return [];
}

function gearTags(item: GearItem): string[] {
  const tags = [item.kind, item.tier, item.handsOn ? "hands-on" : "research score"];

  if (item.kind === "keyboard") {
    tags.push("keyboard", "mechanical keyboard", ...item.connectivity);
    if (item.connectivity.some((connection) => connection !== "USB-C")) tags.push("wireless");
    if (item.connectivity.includes("USB-C")) tags.push("wired");
    if (item.hotSwap) tags.push("hot swap", "hot-swappable");
  } else if (item.kind === "mouse") {
    tags.push("mouse", item.formFactor, item.sensorType, ...item.connectivity);
    if (item.connectivity.some((connection) => connection !== "Wired")) tags.push("wireless");
    if (item.connectivity.includes("Wired")) tags.push("wired");
  } else {
    tags.push("iem", "in-ear monitor", "earphone", "earbud", item.driverConfig, ...(item.signature ?? []));
    if (item.driverConfig !== "Unknown") tags.push("multi-driver", item.driverConfig);
  }

  return [...new Set(tags.filter(Boolean))];
}

function flattenGearItem(item: GearItem): SearchEntry {
  const specs = Object.entries(item)
    .filter(([key]) => !gearEditorialFields.has(key))
    .flatMap(([key, value]) => {
      const flattened = flattenValue(value);
      return flattened.length ? [`${key}: ${flattened.join(" ")}`] : [];
    });
  const body = [
    item.summary,
    ...item.good,
    ...item.annoying,
    ...item.insight,
    item.verdict,
    item.verdictLine,
    ...item.bestFor,
    item.score === undefined ? "Not rated yet" : `Rating ${item.score.toFixed(1)} out of 10`,
    ...(item.ratingReason ? [item.ratingReason] : []),
    item.handsOn ? "Hands-on assessment" : "Research score based on specifications and reviewer consensus",
    ...specs,
  ].join(" ");

  return {
    id: item.id,
    type: item.kind,
    title: item.name,
    subtitle: item.brand,
    url: `/${gearRoutes[item.kind]}/?item=${encodeURIComponent(item.id)}`,
    body,
    tags: gearTags(item),
    specs,
    rating: item.score,
    image: item.images?.[0]?.url,
    imageAlt: item.images?.[0]?.alt || `${item.brand} ${item.name}`,
  };
}

function cleanMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, " ")
    .replace(/[`*_~>#]/g, " ")
    .replace(/^\s*[-+]\s+/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenPost(post: Post): SearchEntry {
  const category = site.categories.find((item) => item.slug === post.data.category);
  const tags = [
    "article",
    "post",
    post.data.category,
    category?.label ?? post.data.category,
    post.data.format,
    ...(post.data.gearType ? [post.data.gearType] : []),
    ...post.data.tags,
  ];

  return {
    id: `article-${getPostSlug(post)}`,
    type: "article",
    title: post.data.title.replace(/^TEST:\s*/i, ""),
    subtitle: category?.label ?? "Article",
    url: `/blog/${getPostSlug(post)}/`,
    body: `${post.data.description} ${cleanMarkdown(post.body ?? "")}`,
    tags: [...new Set(tags)],
    specs: [],
    image: post.data.cover?.src,
    imageAlt: post.data.coverAlt,
  };
}

function flattenPage(page: (typeof searchPages)[number]): SearchEntry {
  return {
    id: page.id,
    type: "page",
    title: page.title,
    subtitle: "Site page",
    url: page.url,
    body: page.headings.join(". "),
    tags: ["page", page.title],
    specs: [],
  };
}

export function buildSearchEntries(posts: Post[]): SearchEntry[] {
  const publishedArticles = posts.filter((post) => {
    const slug = getPostSlug(post);
    return !post.data.draft && !slug.startsWith("test-") && !/^TEST:/i.test(post.data.title);
  });

  return [
    ...getKeyboards().map(flattenGearItem),
    ...getMice().map(flattenGearItem),
    ...getIems().map(flattenGearItem),
    ...publishedArticles.map(flattenPost),
    ...searchPages.map(flattenPage),
  ];
}