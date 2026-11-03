import {
  getOrderedPageIndex,
  getPageTransitionDirection,
  setPostOrder,
} from "../config/pageOrder";

interface BeforePreparationEvent extends Event {
  from: URL;
  to: URL;
  sourceElement: Element | undefined;
  loader: () => Promise<void>;
}

interface BeforeSwapEvent extends Event {
  from: URL;
  to: URL;
  sourceElement: Element | undefined;
  signal: AbortSignal;
  viewTransition: ViewTransition;
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefetchedRoutes = new Set<string>();
let lastOrderedLocation: URL | undefined;
let activeAnimation: Animation | undefined;
let transitionSequence = 0;
let fallbackFadePending = false;
let postOrderRequest: Promise<void> | undefined;

function normalizedPathname(pathname: string): string {
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
}

function navigationSource(from: URL): URL {
  return normalizedPathname(from.pathname) === "/search" && lastOrderedLocation
    ? lastOrderedLocation
    : from;
}

function isPostUrl(url: URL): boolean {
  return /^\/blog\/[^/]+\/?$/.test(url.pathname);
}

function ensurePostOrder(): Promise<void> {
  if (!postOrderRequest) {
    postOrderRequest = fetch("/search-index.json")
      .then((response) => response.ok ? response.json() as Promise<{ type?: string; url?: string }[]> : [])
      .then((entries) => {
        setPostOrder(entries
          .filter((entry) => entry.type === "article" && typeof entry.url === "string" && isPostUrl(new URL(entry.url, window.location.origin)))
          .map((entry) => entry.url as string));
      })
      .catch(() => {
        setPostOrder([]);
        postOrderRequest = undefined;
      });
  }
  return postOrderRequest;
}

function closeSearchOverlay(sourceElement: Element | undefined): Promise<void> {
  const backdrop = sourceElement?.closest<HTMLElement>(".search-dialog-backdrop");
  if (!backdrop) return Promise.resolve();
  backdrop.click();
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function prefetchDestination(event: Event): void {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
  if (
    !anchor ||
    anchor.hasAttribute("download") ||
    anchor.target === "_blank" ||
    anchor.hasAttribute("data-astro-reload")
  ) {
    return;
  }

  const destination = new URL(anchor.href, window.location.href);
  if (destination.origin !== window.location.origin) return;
  if (isPostUrl(destination)) void ensurePostOrder();
  destination.hash = "";
  if (destination.href === window.location.href.split("#")[0]) return;
  if (prefetchedRoutes.has(destination.href)) return;
  prefetchedRoutes.add(destination.href);

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = destination.href;
  document.head.append(link);
}

function epicenter(event: BeforeSwapEvent): { x: number; y: number } {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (normalizedPathname(event.to.pathname) === "/") {
    return { x: width / 2, y: height / 2 };
  }

  const direction = getPageTransitionDirection(navigationSource(event.from), event.to);
  return {
    x: direction === "left-to-right" ? 0 : width,
    y: height / 2,
  };
}

function revealWithFallbackFade(): void {
  if (reducedMotion.matches) return;
  const sequence = transitionSequence;
  const animation = document.documentElement.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 200, easing: "ease-out" },
  );
  activeAnimation = animation;
  document.documentElement.dataset.radialTransitionActive = "true";
  void animation.finished.catch(() => undefined).finally(() => finishAnimation(sequence, animation));
}

function finishAnimation(sequence: number, animation: Animation): void {
  if (sequence !== transitionSequence || activeAnimation !== animation) return;
  activeAnimation = undefined;
  delete document.documentElement.dataset.radialTransitionActive;
}

document.addEventListener("astro:before-preparation", (rawEvent) => {
  const event = rawEvent as BeforePreparationEvent;
  const loadPage = event.loader.bind(event);
  event.loader = async () => {
    await closeSearchOverlay(event.sourceElement);
    const loadPostOrder = isPostUrl(event.from) || isPostUrl(event.to)
      ? ensurePostOrder()
      : Promise.resolve();
    await Promise.all([loadPage(), loadPostOrder]);
  };
});

document.addEventListener("astro:before-swap", (rawEvent) => {
  const event = rawEvent as BeforeSwapEvent;
  delete document.documentElement.dataset.radialTransitionActive;
  activeAnimation?.cancel();
  activeAnimation = undefined;
  transitionSequence += 1;
  const sequence = transitionSequence;
  const from = navigationSource(event.from);
  const direction = getPageTransitionDirection(from, event.to);
  fallbackFadePending = false;

  if (!direction || reducedMotion.matches) return;
  if (typeof document.startViewTransition !== "function") {
    fallbackFadePending = true;
    return;
  }

  event.signal.addEventListener("abort", () => {
    if (sequence !== transitionSequence) return;
    activeAnimation?.cancel();
    activeAnimation = undefined;
  }, { once: true });

  void event.viewTransition.ready.then(() => {
    if (sequence !== transitionSequence || event.signal.aborted || reducedMotion.matches) return;

    const { x, y } = epicenter(event);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(width - x, y),
      Math.hypot(x, height - y),
      Math.hypot(width - x, height - y),
    );

    const animation = document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 650,
        easing: "cubic-bezier(.22, 1, .36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
    activeAnimation = animation;
    document.documentElement.dataset.radialTransitionActive = "true";
    void animation.finished.catch(() => undefined).finally(() => finishAnimation(sequence, animation));
  }).catch(() => undefined);
});

document.addEventListener("astro:after-swap", () => {
  if (fallbackFadePending) {
    fallbackFadePending = false;
    revealWithFallbackFade();
  }
});

function rememberOrderedLocation(): void {
  const location = new URL(window.location.href);
  if (getOrderedPageIndex(location) >= 0) lastOrderedLocation = location;
}

rememberOrderedLocation();
document.addEventListener("astro:page-load", rememberOrderedLocation);
document.addEventListener("pointerover", prefetchDestination, { passive: true });
document.addEventListener("focusin", prefetchDestination);
document.addEventListener("touchstart", prefetchDestination, { passive: true });

function blockInputDuringTransition(event: Event): void {
  if (document.documentElement.dataset.radialTransitionActive !== "true") return;
  event.preventDefault();
  event.stopImmediatePropagation();
}

document.addEventListener("click", blockInputDuringTransition, true);
document.addEventListener("keydown", blockInputDuringTransition, true);
document.addEventListener("wheel", blockInputDuringTransition, { capture: true, passive: false });
document.addEventListener("touchmove", blockInputDuringTransition, { capture: true, passive: false });