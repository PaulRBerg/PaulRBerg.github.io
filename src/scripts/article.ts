const READING_PREFERENCES_KEY = "article-reading-preferences";
const noop = () => {
  // No cleanup is needed when an enhancement is unavailable.
};

const setupReadingPreferences = (signal: AbortSignal) => {
  const controls = document.querySelector<HTMLElement>("[data-reading-preferences]");
  const font = controls?.querySelector<HTMLSelectElement>("[data-reading-font]");
  const size = controls?.querySelector<HTMLSelectElement>("[data-reading-size]");
  if (!controls || !font || !size) {
    return;
  }

  font.value = document.documentElement.dataset.articleFont ?? "mono";
  size.value = document.documentElement.dataset.articleSize ?? "standard";
  controls.hidden = false;

  const applyPreferences = () => {
    document.documentElement.dataset.articleFont = font.value;
    document.documentElement.dataset.articleSize = size.value;
    try {
      localStorage.setItem(
        READING_PREFERENCES_KEY,
        JSON.stringify({ font: font.value, size: size.value })
      );
    } catch {
      // The controls still work when browser storage is unavailable.
    }
  };
  font.addEventListener("change", applyPreferences, { signal });
  size.addEventListener("change", applyPreferences, { signal });
};

const addHeadingLinks = (article: HTMLElement) => {
  const links: HTMLAnchorElement[] = [];
  for (const heading of article.querySelectorAll<HTMLElement>("h2, h3, h4, h5, h6")) {
    if (
      !heading.id ||
      heading.closest("[data-footnotes]") ||
      heading.querySelector(".heading-link")
    ) {
      continue;
    }

    const link = document.createElement("a");
    link.className = "heading-link";
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.setAttribute("aria-label", `Link to ${heading.textContent?.trim() ?? "section"}`);
    link.dataset.pagefindIgnore = "";
    const marker = document.createElement("span");
    marker.ariaHidden = "true";
    marker.textContent = "#";
    link.append(marker);
    heading.append(link);
    links.push(link);
  }
  return () => {
    for (const link of links) {
      link.remove();
    }
  };
};

const setupReadingProgress = (
  article: HTMLElement,
  signal: AbortSignal,
  syncPopover: () => void
) => {
  const track = document.querySelector<HTMLElement>("[data-post-progress]");
  const bar = document.querySelector<HTMLElement>("[data-post-progress-bar]");
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")];
  const sections = [...new Set(links.map((link) => link.dataset.headingId))]
    .map((id) =>
      id !== undefined && id !== ""
        ? document.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
        : null
    )
    .filter((heading) => heading !== null);
  let frame = 0;

  const sync = () => {
    frame = 0;
    const bounds = article.getBoundingClientRect();
    const readingDistance = bounds.height - window.innerHeight;
    const fraction = readingDistance > 0 ? -bounds.top / readingDistance : Number(bounds.top <= 0);
    const progress = Math.max(0, Math.min(fraction, 1));
    if (track && bar) {
      bar.style.transform = `scaleX(${progress})`;
      track.dataset.active = String(progress > 0);
    }

    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top > Math.min(160, window.innerHeight * 0.25)) {
        break;
      }
      current = section.id;
    }
    for (const link of links) {
      if (link.dataset.headingId === current) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
    syncPopover();
  };

  const queueSync = () => {
    if (!frame) {
      frame = window.requestAnimationFrame(sync);
    }
  };
  window.addEventListener("scroll", queueSync, { passive: true, signal });
  window.addEventListener("resize", queueSync, { signal });
  const observer = new ResizeObserver(queueSync);
  observer.observe(article);
  queueSync();

  for (const link of links) {
    link.addEventListener(
      "click",
      () => {
        link.closest("details")?.removeAttribute("open");
      },
      {
        signal
      }
    );
  }

  return () => {
    window.cancelAnimationFrame(frame);
    observer.disconnect();
  };
};

const cleanFootnoteContent = (note: HTMLElement) => {
  const clone = note.cloneNode(true);
  if (!(clone instanceof HTMLElement)) {
    return [];
  }
  clone.removeAttribute("id");
  for (const element of clone.querySelectorAll("[id]")) {
    element.removeAttribute("id");
  }
  for (const artifact of clone.querySelectorAll(
    "[data-footnote-backref], .heading-link, .copy-code, .expressive-code .copy"
  )) {
    artifact.remove();
  }
  for (const trigger of clone.querySelectorAll("[data-image-trigger]")) {
    trigger.replaceWith(...trigger.childNodes);
  }
  return [...clone.childNodes];
};

const setupFootnotes = (article: HTMLElement, signal: AbortSignal) => {
  const references = [...article.querySelectorAll<HTMLAnchorElement>("[data-footnote-ref]")];
  if (!references.length || !("showPopover" in HTMLElement.prototype)) {
    return { cleanup: noop, sync: noop };
  }

  const popover = document.createElement("aside");
  popover.className = "footnote-popover";
  popover.id = "article-footnote-popover";
  popover.popover = "auto";
  popover.dataset.pagefindIgnore = "";
  popover.setAttribute("role", "dialog");
  const header = document.createElement("div");
  header.className = "footnote-popover-header";
  const title = document.createElement("span");
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.setAttribute("aria-label", "Close footnote");
  header.append(title, close);
  const content = document.createElement("div");
  content.className = "footnote-popover-content app-prose";
  popover.append(header, content);
  document.body.append(popover);
  let activeReference: HTMLAnchorElement | undefined;

  const position = () => {
    if (!activeReference || !popover.matches(":popover-open")) {
      return;
    }
    const anchor = activeReference.getBoundingClientRect();
    const bounds = popover.getBoundingClientRect();
    const left = Math.max(16, Math.min(anchor.left, window.innerWidth - bounds.width - 16));
    const below = anchor.bottom + 12;
    const top =
      below + bounds.height <= window.innerHeight - 16 ? below : anchor.top - bounds.height - 12;
    popover.style.left = `${left}px`;
    popover.style.top = `${Math.max(16, top)}px`;
  };

  const openFootnote = (event: MouseEvent) => {
    const reference = event.currentTarget;
    if (!(reference instanceof HTMLAnchorElement)) {
      return;
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const note = article.querySelector<HTMLElement>(
      `#${CSS.escape(decodeURIComponent(reference.hash.slice(1)))}`
    );
    if (!note) {
      return;
    }
    event.preventDefault();
    activeReference?.setAttribute("aria-expanded", "false");
    activeReference = reference;
    const label = `Footnote ${reference.textContent?.trim() ?? ""}`.trim();
    title.textContent = label;
    popover.setAttribute("aria-label", label);
    content.replaceChildren(...cleanFootnoteContent(note));
    popover.scrollTop = 0;
    reference.setAttribute("aria-expanded", "true");
    if (!popover.matches(":popover-open")) {
      popover.showPopover();
    }
    position();
    close.focus({ preventScroll: true });
  };
  for (const reference of references) {
    reference.setAttribute("aria-haspopup", "dialog");
    reference.setAttribute("aria-expanded", "false");
    reference.setAttribute("aria-controls", popover.id);
    reference.addEventListener("click", openFootnote, { signal });
  }
  close.addEventListener(
    "click",
    () => {
      popover.hidePopover();
    },
    { signal }
  );
  popover.addEventListener(
    "toggle",
    () => {
      if (!popover.matches(":popover-open")) {
        activeReference?.setAttribute("aria-expanded", "false");
        if (document.activeElement === document.body || popover.contains(document.activeElement)) {
          activeReference?.focus({ preventScroll: true });
        }
        activeReference = undefined;
      }
    },
    { signal }
  );

  return {
    cleanup: () => {
      popover.remove();
      for (const reference of references) {
        reference.removeAttribute("aria-haspopup");
        reference.removeAttribute("aria-expanded");
        reference.removeAttribute("aria-controls");
      }
    },
    sync: position
  };
};

// Astro's widest responsive candidate keeps the source image's full dimensions.
const largestImageSource = (source: HTMLImageElement) => {
  let largest = { url: source.currentSrc || source.src, width: 0 };
  for (const candidate of source.srcset.split(/,\s+/u)) {
    const [url, descriptor] = candidate.trim().split(/\s+/u);
    const width = Number(descriptor?.replace(/w$/u, ""));
    if (url && width > largest.width) {
      largest = { url, width };
    }
  }
  return largest.url;
};

const setupImageDialog = (article: HTMLElement, signal: AbortSignal) => {
  const dialog = document.querySelector<HTMLDialogElement>("[data-image-dialog]");
  const image = dialog?.querySelector<HTMLImageElement>("[data-image-dialog-image]");
  const caption = dialog?.querySelector<HTMLElement>("[data-image-caption]");
  const viewport = dialog?.querySelector<HTMLElement>("[data-image-viewport]");
  const originalSize = dialog?.querySelector<HTMLButtonElement>("[data-image-original-size]");
  const close = dialog?.querySelector<HTMLButtonElement>("[data-image-close]");
  if (
    !dialog ||
    !image ||
    !caption ||
    !viewport ||
    !originalSize ||
    !close ||
    typeof dialog.showModal !== "function"
  ) {
    return noop;
  }
  const triggers: HTMLButtonElement[] = [];
  let activeTrigger: HTMLButtonElement | undefined;

  const resetSize = () => {
    dialog.classList.remove("is-original-size");
    originalSize.setAttribute("aria-pressed", "false");
    originalSize.textContent = "View original size";
    viewport.scrollTo(0, 0);
  };

  const openImage = (event: MouseEvent) => {
    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLButtonElement)) {
      return;
    }
    const source = trigger.querySelector("img");
    if (!source) {
      return;
    }
    const description = source.alt.trim();
    activeTrigger = trigger;
    image.src = largestImageSource(source);
    image.alt = source.alt;
    caption.textContent = source.alt;
    caption.hidden = !description;
    if (description) {
      dialog.setAttribute("aria-describedby", caption.id);
    } else {
      dialog.removeAttribute("aria-describedby");
    }
    resetSize();
    dialog.showModal();
    close.focus({ preventScroll: true });
  };

  for (const source of article.querySelectorAll<HTMLImageElement>("img")) {
    if (source.closest("a, button, .link-preview, [data-no-zoom]")) {
      continue;
    }
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "article-image-trigger";
    trigger.dataset.imageTrigger = "";
    const description = source.alt.trim();
    trigger.setAttribute(
      "aria-label",
      description ? `Enlarge image: ${description}` : "Enlarge image"
    );
    trigger.setAttribute("aria-haspopup", "dialog");
    const target = source.closest("picture") ?? source;
    target.before(trigger);
    trigger.append(target);
    trigger.addEventListener("click", openImage, { signal });
    triggers.push(trigger);
  }

  originalSize.addEventListener(
    "click",
    () => {
      const original = dialog.classList.toggle("is-original-size");
      originalSize.setAttribute("aria-pressed", String(original));
      originalSize.textContent = original ? "Fit to screen" : "View original size";
      viewport.scrollTo(0, 0);
    },
    { signal }
  );
  close.addEventListener(
    "click",
    () => {
      dialog.close();
    },
    { signal }
  );
  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          dialog.close();
        }
      }
    },
    { signal }
  );
  dialog.addEventListener(
    "close",
    () => {
      resetSize();
      image.removeAttribute("src");
      activeTrigger?.focus({ preventScroll: true });
      activeTrigger = undefined;
    },
    { signal }
  );

  return () => {
    dialog.close();
    image.removeAttribute("src");
    resetSize();
    for (const trigger of triggers) {
      trigger.replaceWith(...trigger.childNodes);
    }
  };
};

const initializeArticle = () => {
  const article = document.querySelector<HTMLElement>("#article");
  if (!article) {
    return noop;
  }
  const controller = new AbortController();
  setupReadingPreferences(controller.signal);
  const removeHeadingLinks = addHeadingLinks(article);
  const footnotes = setupFootnotes(article, controller.signal);
  const stopReadingProgress = setupReadingProgress(article, controller.signal, footnotes.sync);
  const resetImages = setupImageDialog(article, controller.signal);
  return () => {
    controller.abort();
    stopReadingProgress();
    footnotes.cleanup();
    resetImages();
    removeHeadingLinks();
  };
};

let cleanupArticle = noop;
const setupArticle = () => {
  cleanupArticle();
  cleanupArticle = initializeArticle();
};
document.addEventListener("astro:page-load", setupArticle);
document.addEventListener("astro:before-swap", () => {
  cleanupArticle();
  cleanupArticle = noop;
});
setupArticle();
