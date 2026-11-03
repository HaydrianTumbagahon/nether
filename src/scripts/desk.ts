import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let cleanupWebPostPagination: (() => void) | undefined;

function initializeDeskStrips(): void {
  for (const strip of document.querySelectorAll<HTMLElement>(
    "[data-drag-strip]",
  )) {
    if (strip.dataset.dragReady === "true") continue;
    strip.dataset.dragReady = "true";

    let pointerStart = 0;
    let scrollStart = 0;
    let dragging = false;
    let moved = false;

    strip.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      pointerStart = event.clientX;
      scrollStart = strip.scrollLeft;
      dragging = true;
      moved = false;
      strip.setPointerCapture(event.pointerId);
      strip.dataset.dragging = "true";
    });

    strip.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const distance = event.clientX - pointerStart;
      if (Math.abs(distance) > 4) moved = true;
      if (moved) strip.scrollLeft = scrollStart - distance;
    });

    const stopDragging = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete strip.dataset.dragging;
      if (strip.hasPointerCapture(event.pointerId)) {
        strip.releasePointerCapture(event.pointerId);
      }
      if (moved) {
        strip.dataset.dragged = "true";
        window.setTimeout(() => delete strip.dataset.dragged, 0);
      }
    };

    strip.addEventListener("pointerup", stopDragging);
    strip.addEventListener("pointercancel", stopDragging);
    strip.addEventListener(
      "click",
      (event) => {
        if (strip.dataset.dragged !== "true") return;
        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
  }
}

function initializeWebPostPagination(): void {
  const slider = document.querySelector<HTMLElement>("[data-web-post-slider]");
  if (!slider || slider.dataset.pagingReady === "true") return;
  const viewportElement = slider.querySelector<HTMLElement>("[data-web-post-viewport]");
  const listElement = slider.querySelector<HTMLOListElement>("[data-web-post-list]");
  const pagination = slider.querySelector<HTMLElement>("[data-web-post-pagination]");
  if (!viewportElement || !listElement || !pagination) return;
  const viewport = viewportElement;
  const list = listElement;

  const posts = Array.from(list.querySelectorAll<HTMLLIElement>("[data-web-post]"));
  const dots = Array.from(
    pagination.querySelectorAll<HTMLButtonElement>("[data-web-post-page]"),
  );
  const pageSize = 5;
  const pageCount = Math.ceil(posts.length / pageSize);
  if (pageCount < 2 || dots.length !== pageCount) return;
  let rowHeight = 0;

  slider.dataset.pagingReady = "true";
  viewport.dataset.pagingActive = "true";
  list.dataset.pagingActive = "true";
  pagination.hidden = false;
  rowHeight = posts[0]?.getBoundingClientRect().height ?? 0;
  viewport.style.height = `${rowHeight * pageSize}px`;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  let currentPage = 0;
  let autoAdvanceTimer = 0;
  let pointerInside = false;
  let focusInside = false;
  let pointerStart: { id: number; x: number; y: number; moved: boolean } | undefined;
  let dragged = false;

  function setActiveDot(page: number): void {
    dots.forEach((dot, index) => {
      if (index === page) dot.setAttribute("aria-current", "page");
      else dot.removeAttribute("aria-current");
    });
  }

  function refreshCarouselLayout(): void {
    const nextRowHeight = posts[0]?.getBoundingClientRect().height ?? 0;
    if (nextRowHeight <= 0 || Math.abs(nextRowHeight - rowHeight) < 0.5) return;
    rowHeight = nextRowHeight;
    viewport.style.height = `${rowHeight * pageSize}px`;
    gsap.set(list, { y: -currentPage * pageSize * rowHeight });
    ScrollTrigger.refresh();
  }

  function scheduleAutoAdvance(): void {
    window.clearTimeout(autoAdvanceTimer);
    if (reducedMotion.matches || pointerInside || focusInside) return;
    autoAdvanceTimer = window.setTimeout(() => changePage(currentPage + 1), 15_000);
  }

  function changePage(requestedPage: number): void {
    window.clearTimeout(autoAdvanceTimer);
    const nextPage = (requestedPage + pageCount) % pageCount;
    if (nextPage === currentPage) {
      scheduleAutoAdvance();
      return;
    }

    currentPage = nextPage;
    setActiveDot(currentPage);
    const y = -currentPage * pageSize * rowHeight;

    gsap.killTweensOf(list);
    gsap.killTweensOf(posts);
    gsap.set(posts, { clearProps: "opacity,transform,visibility" });
    if (reducedMotion.matches) {
      gsap.set(list, { y });
      return;
    }

    gsap.to(list, {
      y,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        const enteringPosts = posts.slice(
          currentPage * pageSize,
          (currentPage + 1) * pageSize,
        );
        gsap.fromTo(
          enteringPosts,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(enteringPosts, { autoAlpha: 1, y: 0 });
              scheduleAutoAdvance();
            },
          },
        );
      },
    });
  }

  function finishPointer(event: PointerEvent): void {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const start = pointerStart;
    pointerStart = undefined;
    delete viewport.dataset.dragging;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    const deltaY = event.clientY - start.y;
    const deltaX = event.clientX - start.x;
    if (!start.moved || Math.abs(deltaY) < 48 || Math.abs(deltaY) <= Math.abs(deltaX)) return;

    if (event.pointerType === "mouse") {
      dragged = true;
      window.setTimeout(() => {
        dragged = false;
      }, 0);
    }
    changePage(currentPage + (deltaY < 0 ? 1 : -1));
  }

  gsap.set(list, { y: 0 });
  ScrollTrigger.refresh();
  setActiveDot(currentPage);
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const page = Number(dot.dataset.webPostPage);
      if (Number.isInteger(page)) changePage(page);
    }, { signal: controller.signal });
  });

  slider.addEventListener("pointerenter", () => {
    pointerInside = true;
    window.clearTimeout(autoAdvanceTimer);
  }, { signal: controller.signal });
  slider.addEventListener("pointerleave", () => {
    pointerInside = false;
    scheduleAutoAdvance();
  }, { signal: controller.signal });
  slider.addEventListener("focusin", () => {
    focusInside = true;
    window.clearTimeout(autoAdvanceTimer);
  }, { signal: controller.signal });
  slider.addEventListener("focusout", (event) => {
    if (slider.contains(event.relatedTarget as Node | null)) return;
    focusInside = false;
    scheduleAutoAdvance();
  }, { signal: controller.signal });

  viewport.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerStart = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  }, { signal: controller.signal });
  viewport.addEventListener("pointermove", (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaY = event.clientY - pointerStart.y;
    const deltaX = event.clientX - pointerStart.x;
    if (Math.abs(deltaY) > 6 && Math.abs(deltaY) > Math.abs(deltaX)) {
      pointerStart.moved = true;
      if (!viewport.hasPointerCapture(event.pointerId)) {
        viewport.setPointerCapture(event.pointerId);
      }
      if (event.pointerType === "mouse") viewport.dataset.dragging = "true";
    }
  }, { signal: controller.signal });
  viewport.addEventListener("pointerup", finishPointer, { signal: controller.signal });
  viewport.addEventListener("pointercancel", (event) => {
    if (pointerStart?.id === event.pointerId) pointerStart = undefined;
    delete viewport.dataset.dragging;
  }, { signal: controller.signal });
  viewport.addEventListener("click", (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
  }, { capture: true, signal: controller.signal });

  function handleMotionPreferenceChange(): void {
    window.clearTimeout(autoAdvanceTimer);
    gsap.killTweensOf(list);
    if (reducedMotion.matches) {
      gsap.set(list, { y: -currentPage * pageSize * rowHeight });
    } else {
      scheduleAutoAdvance();
    }
  }

  reducedMotion.addEventListener("change", handleMotionPreferenceChange, {
    signal: controller.signal,
  });
  window.addEventListener("resize", refreshCarouselLayout, {
    signal: controller.signal,
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
  scheduleAutoAdvance();

  cleanupWebPostPagination = () => {
    window.clearTimeout(autoAdvanceTimer);
    gsap.killTweensOf(list);
    gsap.set(list, { clearProps: "transform" });
    viewport.style.removeProperty("height");
    ScrollTrigger.refresh();
    controller.abort();
    delete slider.dataset.pagingReady;
    delete viewport.dataset.pagingActive;
    delete list.dataset.pagingActive;
    pagination.hidden = true;
  };
}

function cleanupDeskPage(): void {
  cleanupWebPostPagination?.();
  cleanupWebPostPagination = undefined;
}

document.addEventListener("astro:page-load", initializeDeskStrips);
document.addEventListener("astro:page-load", initializeWebPostPagination);
document.addEventListener("astro:before-swap", cleanupDeskPage);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeDeskStrips();
    initializeWebPostPagination();
  }, {
    once: true,
  });
} else {
  initializeDeskStrips();
  initializeWebPostPagination();
}
