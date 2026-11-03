let tocObserver: IntersectionObserver | undefined;

function clearArticleTools(): void {
  tocObserver?.disconnect();
  tocObserver = undefined;
}

function setupCodeBlocks(article: HTMLElement): void {
  for (const pre of article.querySelectorAll<HTMLPreElement>("pre")) {
    if (pre.dataset.copyReady === "true") continue;
    pre.dataset.copyReady = "true";

    const filenameContainer = pre.closest<HTMLElement>("[data-code-filename]");
    const filename = filenameContainer?.dataset.codeFilename ?? "Code sample";
    let toolbar = filenameContainer?.querySelector<HTMLElement>(
      ":scope > figcaption",
    );

    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "code-toolbar";
      toolbar.textContent = filename;
      pre.before(toolbar);
    } else {
      toolbar.classList.add("code-toolbar");
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.textContent = "Copy";
    button.setAttribute("aria-label", `Copy code from ${filename}`);
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          pre.querySelector("code")?.textContent ?? pre.textContent ?? "",
        );
        button.textContent = "Copied";
        window.setTimeout(() => (button.textContent = "Copy"), 1600);
      } catch {
        button.textContent = "Copy unavailable";
      }
    });
    toolbar.append(button);
  }
}

function setupHeadingAnchors(article: HTMLElement): void {
  for (const heading of article.querySelectorAll<HTMLElement>(
    "h2[id], h3[id]",
  )) {
    if (heading.querySelector(".heading-anchor")) continue;

    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = `#${encodeURIComponent(heading.id)}`;
    anchor.setAttribute(
      "aria-label",
      `Link to ${heading.textContent?.trim() ?? "section"}`,
    );
    anchor.textContent = "#";
    heading.append(" ", anchor);
  }
}

function initializeArticleTools(): void {
  clearArticleTools();
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "a[data-copy-link]",
  )) {
    if (link.dataset.copyReady === "true") continue;
    link.dataset.copyReady = "true";
    const originalText = link.textContent ?? "Copy link";
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        await navigator.clipboard.writeText(link.href);
        link.textContent = "Copied";
        window.setTimeout(() => (link.textContent = originalText), 1600);
      } catch {
        window.location.assign(link.href);
      }
    });
  }

  const article = document.querySelector<HTMLElement>("[data-article-content]");
  if (!article) return;

  setupHeadingAnchors(article);
  setupCodeBlocks(article);

  const toc = document.querySelector<HTMLElement>("[data-post-toc]");
  if (!toc) return;

  const links = Array.from(
    toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']"),
  );
  const headings = links
    .map((link) =>
      document.getElementById(decodeURIComponent(link.hash.slice(1))),
    )
    .filter(
      (heading): heading is HTMLElement => heading instanceof HTMLElement,
    );
  if (headings.length === 0) return;

  const setCurrent = (heading: HTMLElement) => {
    for (const link of links) {
      if (decodeURIComponent(link.hash.slice(1)) === heading.id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  setCurrent(headings[0]);
  tocObserver = new IntersectionObserver(
    (entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            first.boundingClientRect.top - second.boundingClientRect.top,
        )[0];
      if (current?.target instanceof HTMLElement) setCurrent(current.target);
    },
    { rootMargin: "-18% 0px -72% 0px", threshold: 0 },
  );

  headings.forEach((heading) => tocObserver?.observe(heading));
}

document.addEventListener("astro:before-swap", clearArticleTools);
document.addEventListener("astro:page-load", initializeArticleTools);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeArticleTools, {
    once: true,
  });
} else {
  initializeArticleTools();
}
