import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const MOTION_TOKENS = {
  ease: "power2.out",
  revealDuration: 0.56,
  outroDuration: 0.32,
  staggerDuration: 0.56,
  splitDuration: 0.48,
  maskDuration: 0.65,
  progressDuration: 0.65,
  rise: 20,
  stagger: 0.08,
} as const;

type SplitMode = "words" | "lines";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const splitCleanups: (() => void)[] = [];
const revealTriggers = new Map<Element, ScrollTrigger>();
const revealTweens = new Set<gsap.core.Tween>();
const imageRefreshListeners = new WeakSet<HTMLImageElement>();
let motionContext: ReturnType<typeof gsap.context> | undefined;
let lenis: Lenis | undefined;
let tickerCallback: ((time: number) => void) | undefined;
let initialized = false;

function trackRevealTween(tween: gsap.core.Tween): void {
  revealTweens.add(tween);
  tween.eventCallback("onComplete", () => revealTweens.delete(tween));
}

function animateOnScroll(
  targets: Element[],
  trigger: Element,
  duration: number,
  outroDuration: number,
  stagger = 0,
  endTrigger: Element = trigger,
): void {
  if (reducedMotion.matches || revealTriggers.has(trigger)) return;

  gsap.set(targets, { autoAlpha: 0, y: MOTION_TOKENS.rise });

  const animateIn = (direction: 1 | -1) => {
    gsap.killTweensOf(targets);
    trackRevealTween(
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: direction * MOTION_TOKENS.rise },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          stagger,
          ease: MOTION_TOKENS.ease,
          overwrite: "auto",
        },
      ),
    );
  };
  const animateOut = (direction: 1 | -1) => {
    gsap.killTweensOf(targets);
    trackRevealTween(
      gsap.to(targets, {
        autoAlpha: 0,
        y: direction * -MOTION_TOKENS.rise,
        duration: outroDuration,
        stagger,
        ease: MOTION_TOKENS.ease,
        overwrite: "auto",
      }),
    );
  };

  const scrollTrigger = ScrollTrigger.create({
      trigger,
      endTrigger,
      start: "top 88%",
      end: "bottom 12%",
      onEnter: () => animateIn(1),
      onLeave: () => animateOut(1),
      onEnterBack: () => animateIn(-1),
      onLeaveBack: () => animateOut(-1),
    });
  revealTriggers.set(trigger, scrollTrigger);
}

function addReveal(target: Element, trigger: Element, duration: number): void {
  animateOnScroll(
    [target],
    trigger,
    duration,
    MOTION_TOKENS.outroDuration,
  );
}

function hasMotionOwner(element: HTMLElement): boolean {
  return Boolean(
    element.closest(
      "[data-reveal], [data-split], [data-stagger], [data-parallax], [data-web-post-list]",
    ),
  );
}

function revealPageContent(scope: ParentNode = document): void {
  const containers = scope.querySelectorAll<HTMLElement>(
    "main section, main article, main header, main footer, main nav, main ul, main ol, main figure, main aside",
  );
  for (const container of containers) {
    if (!hasMotionOwner(container)) {
      addReveal(container, container, MOTION_TOKENS.revealDuration);
    }
  }

  const textBlocks = Array.from(
    scope.querySelectorAll<HTMLElement>(
      "main h1, main h2, main h3, main h4, main p, main li, main blockquote, main figcaption",
    ),
  ).filter((element) => !hasMotionOwner(element));
  const groups = new Map<HTMLElement, HTMLElement[]>();

  for (const element of textBlocks) {
    const parent = element.parentElement;
    if (!parent) continue;
    const group = groups.get(parent) ?? [];
    group.push(element);
    groups.set(parent, group);
  }

  for (const [parent, elements] of groups) {
    for (let index = 0; index < elements.length; index += 3) {
      const group = elements.slice(index, index + 3);
      const first = group[0];
      const last = group[group.length - 1];
      if (first && last) {
        animateOnScroll(
          group,
          first,
          MOTION_TOKENS.revealDuration,
          MOTION_TOKENS.outroDuration,
          0.055,
          last,
        );
      }
    }
  }
}

export function reveal(scope: ParentNode = document): void {
  if (reducedMotion.matches) return;

  for (const element of scope.querySelectorAll<HTMLElement>("[data-reveal]")) {
    if (element.dataset.reveal !== "mask") {
      addReveal(element, element, MOTION_TOKENS.revealDuration);
    }
  }
}

export function staggeredList(scope: ParentNode = document): void {
  if (reducedMotion.matches) return;

  for (const list of scope.querySelectorAll<HTMLElement>("[data-stagger]")) {
    const items = Array.from(list.children);
    if (items.length === 0) continue;

    animateOnScroll(
      items,
      list,
      MOTION_TOKENS.staggerDuration,
      MOTION_TOKENS.outroDuration,
      MOTION_TOKENS.stagger,
    );
  }
}

export function splitHeading(
  element: HTMLElement,
  mode: SplitMode,
): HTMLElement[] | null {
  if (reducedMotion.matches || element.children.length > 0) return null;

  const originalHtml = element.innerHTML;
  const originalAriaLabel = element.getAttribute("aria-label");
  const text = element.textContent?.trim() ?? "";

  try {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return null;

    const wordElements = words.map((word) => {
      const span = document.createElement("span");
      span.className = "motion-split-word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      return span;
    });

    const wordFragment = document.createDocumentFragment();
    wordElements.forEach((word, index) => {
      wordFragment.append(word);
      if (index < wordElements.length - 1) wordFragment.append(" ");
    });
    element.replaceChildren(wordFragment);
    if (originalAriaLabel === null) element.setAttribute("aria-label", text);

    if (mode === "words") {
      splitCleanups.push(() =>
        restoreSplit(element, originalHtml, originalAriaLabel),
      );
      return wordElements;
    }

    const lines: { top: number; words: HTMLElement[] }[] = [];
    for (const word of wordElements) {
      const top = word.getBoundingClientRect().top;
      const line = lines.at(-1);
      if (!line || Math.abs(line.top - top) > 2) {
        lines.push({ top, words: [word] });
      } else {
        line.words.push(word);
      }
    }

    const lineFragment = document.createDocumentFragment();
    const lineElements = lines.map(({ words: lineWords }) => {
      const line = document.createElement("span");
      line.className = "motion-split-line";
      line.setAttribute("aria-hidden", "true");
      lineWords.forEach((word, index) => {
        line.append(word);
        if (index < lineWords.length - 1) line.append(" ");
      });
      lineFragment.append(line);
      return line;
    });
    element.replaceChildren(lineFragment);
    splitCleanups.push(() =>
      restoreSplit(element, originalHtml, originalAriaLabel),
    );
    return lineElements;
  } catch {
    restoreSplit(element, originalHtml, originalAriaLabel);
    return null;
  }
}

function restoreSplit(
  element: HTMLElement,
  originalHtml: string,
  originalAriaLabel: string | null,
): void {
  element.innerHTML = originalHtml;
  if (originalAriaLabel === null) element.removeAttribute("aria-label");
  else element.setAttribute("aria-label", originalAriaLabel);
}

export function revealSplitHeadings(scope: ParentNode = document): void {
  if (reducedMotion.matches) return;

  for (const element of scope.querySelectorAll<HTMLElement>("[data-split]")) {
    const mode = element.dataset.split === "lines" ? "lines" : "words";
    const targets = splitHeading(element, mode);
    if (!targets) {
      addReveal(element, element, MOTION_TOKENS.splitDuration);
      continue;
    }

    animateOnScroll(
      targets,
      element,
      MOTION_TOKENS.splitDuration,
      MOTION_TOKENS.outroDuration,
      mode === "words" ? 0.025 : 0.07,
    );
  }
}

export function imageMaskReveal(scope: ParentNode = document): void {
  if (reducedMotion.matches) return;

  for (const element of scope.querySelectorAll<HTMLElement>(
    '[data-reveal="mask"]',
  )) {
    const image = element.querySelector("img, svg, video");
    if (!image) {
      addReveal(element, element, MOTION_TOKENS.maskDuration);
      continue;
    }

    const mask = image.parentElement;
    if (mask && !mask.classList.contains("motion-mask")) {
      mask.classList.add("motion-mask");
      splitCleanups.push(() => mask.classList.remove("motion-mask"));
    }

    animateOnScroll(
      [image],
      element,
      MOTION_TOKENS.maskDuration,
      MOTION_TOKENS.outroDuration,
    );
  }
}

export function subtleParallax(scope: ParentNode = document): void {
  if (reducedMotion.matches) return;

  for (const element of scope.querySelectorAll<HTMLElement>(
    "[data-parallax]",
  )) {
    const requestedAmount = Number(element.dataset.parallax);
    const amount =
      Number.isFinite(requestedAmount) && requestedAmount > 0
        ? Math.min(requestedAmount, 0.06)
        : 0.03;

    gsap.fromTo(
      element,
      { yPercent: amount * -100 },
      {
        yPercent: amount * 100,
        duration: MOTION_TOKENS.revealDuration,
        ease: MOTION_TOKENS.ease,
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  }
}

export function readingProgress(scope: ParentNode = document): void {
  if (reducedMotion.matches) return;

  for (const bar of scope.querySelectorAll<HTMLElement>(
    "[data-reading-progress]",
  )) {
    gsap.set(bar, { transformOrigin: "left center" });
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: MOTION_TOKENS.progressDuration,
        ease: MOTION_TOKENS.ease,
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: ({ progress }) => {
            bar.setAttribute(
              "aria-valuenow",
              String(Math.round(progress * 100)),
            );
          },
        },
      },
    );
  }
}

function syncScrollTrigger(): void {
  ScrollTrigger.update();
  updateScrollEdgeOverlays();
}

function updateScrollEdgeOverlays(): void {
  const topOverlay = document.querySelector<HTMLElement>(
    ".scroll-edge-overlay-top",
  );
  const bottomOverlay = document.querySelector<HTMLElement>(
    ".scroll-edge-overlay-bottom",
  );
  const scrollTopButton = document.querySelector<HTMLButtonElement>(
    "[data-scroll-to-top]",
  );
  const scroll = lenis?.scroll ?? window.scrollY;
  const limit = lenis?.limit ?? Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );

  if (topOverlay) topOverlay.style.opacity = scroll < 10 ? "0" : "1";
  if (bottomOverlay) {
    bottomOverlay.style.opacity = limit - scroll < 10 ? "0" : "1";
  }
  if (scrollTopButton) {
    const visible = scroll >= 400;
    scrollTopButton.dataset.visible = String(visible);
    scrollTopButton.setAttribute("aria-hidden", String(!visible));
    scrollTopButton.tabIndex = visible ? 0 : -1;
    scrollTopButton.inert = !visible;
    if (!visible && document.activeElement === scrollTopButton) {
      scrollTopButton.blur();
    }
  }
}

function handleNativeScroll(): void {
  updateScrollEdgeOverlays();
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>("[data-scroll-to-top]");
  if (!button) return;

  event.preventDefault();
  if (reducedMotion.matches || !lenis) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  lenis.scrollTo(0, {
    duration: 1.4,
    easing: (progress) => 1 - Math.pow(1 - progress, 4),
  });
});

function refreshAfterAssets(): void {
  if (reducedMotion.matches) return;

  requestAnimationFrame(() => ScrollTrigger.refresh());
  void document.fonts?.ready.then(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  for (const image of document.images) {
    if (imageRefreshListeners.has(image)) continue;
    imageRefreshListeners.add(image);

    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    image.addEventListener("load", refresh, { once: true });
    image.addEventListener("error", refresh, { once: true });
    if (image.complete) void image.decode().then(refresh).catch(() => undefined);
  }
}

export function destroyMotion(): void {
  window.removeEventListener("scroll", handleNativeScroll);
  for (const trigger of revealTriggers.values()) trigger.kill();
  revealTriggers.clear();
  for (const tween of revealTweens) tween.kill();
  revealTweens.clear();
  motionContext?.revert();
  motionContext = undefined;

  for (const cleanup of splitCleanups.splice(0).reverse()) cleanup();

  if (lenis) {
    lenis.off("scroll", syncScrollTrigger);
    lenis.destroy();
    lenis = undefined;
  }

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = undefined;
    gsap.ticker.lagSmoothing(500, 33);
  }

  initialized = false;
}

export function initializeMotion(): void {
  if (initialized) return;
  initialized = true;
  updateScrollEdgeOverlays();
  if (reducedMotion.matches) {
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    return;
  }

  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.06,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on("scroll", syncScrollTrigger);
  syncScrollTrigger();
  tickerCallback = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  motionContext = gsap.context(() => {
    revealPageContent();
    reveal();
    staggeredList();
    revealSplitHeadings();
    imageMaskReveal();
    subtleParallax();
    readingProgress();
  });

  refreshAfterAssets();
}

function handleMotionPreferenceChange(): void {
  destroyMotion();
  initializeMotion();
}

document.addEventListener("astro:before-swap", destroyMotion);
document.addEventListener("astro:page-load", initializeMotion);
window.addEventListener("load", refreshAfterAssets, { once: true });
reducedMotion.addEventListener("change", handleMotionPreferenceChange);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMotion, {
    once: true,
  });
} else {
  initializeMotion();
}
