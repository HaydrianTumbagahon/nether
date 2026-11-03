export type PageTransitionDirection = "right-to-left" | "left-to-right";

const pageOrder = [
  { name: "Home", matches: (pathname: string) => pathname === "/" },
  {
    name: "Web Dev",
    matches: (pathname: string) =>
      /^\/(?:blog|category\/(?:web-development|web-dev|ai-web))(?:\/|$)/.test(pathname),
  },
  { name: "Keyboards", matches: (pathname: string) => pathname === "/keyboards" },
  { name: "Mice", matches: (pathname: string) => pathname === "/mice" },
  { name: "IEMs", matches: (pathname: string) => pathname === "/iems" },
  { name: "About", matches: (pathname: string) => pathname === "/about" },
  { name: "Contact", matches: (pathname: string) => pathname === "/contact" },
  { name: "Disclosure", matches: (pathname: string) => pathname === "/disclosure" },
  { name: "Privacy", matches: (pathname: string) => pathname === "/privacy" },
  { name: "Terms", matches: (pathname: string) => pathname === "/terms" },
] as const;

let postOrder = new Map<string, number>();

function normalizedPathname(pathname: string): string {
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
}

export function setPostOrder(postUrls: string[]): void {
  postOrder = new Map(
    postUrls.map((path, index) => [normalizedPathname(new URL(path, "https://site.test").pathname), index]),
  );
}

export function getOrderedPageIndex(url: URL): number {
  if (url.searchParams.has("item")) return -1;
  const pathname = normalizedPathname(url.pathname);
  if (/^\/blog\/[^/]+$/.test(pathname)) {
    const webDevIndex = pageOrder.findIndex((page) => page.name === "Web Dev");
    const postIndex = postOrder.get(pathname);
    if (postIndex === undefined) return webDevIndex + 0.5;
    return webDevIndex + (postIndex + 1) / (postOrder.size + 1);
  }
  return pageOrder.findIndex((page) => page.matches(pathname));
}

export function getPageTransitionDirection(
  from: URL,
  to: URL,
): PageTransitionDirection | undefined {
  if (normalizedPathname(from.pathname) === normalizedPathname(to.pathname)) {
    return undefined;
  }

  if (from.searchParams.has("item") || to.searchParams.has("item")) return undefined;

  const fromIndex = getOrderedPageIndex(from);
  const toIndex = getOrderedPageIndex(to);
  if (fromIndex >= 0 && fromIndex === toIndex) return undefined;

  return fromIndex >= 0 && toIndex >= 0 && toIndex < fromIndex
    ? "left-to-right"
    : "right-to-left";
}