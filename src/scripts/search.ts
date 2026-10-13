import type * as PagefindComponents from "@pagefind/component-ui";
import type { PagefindModal } from "@pagefind/component-ui";

type Components = typeof PagefindComponents;
interface HighlightModule {
  default: new (options: {
    addStyles: boolean;
    highlightParam: string;
    markContext: HTMLElement;
    markOptions: { className: string; exclude: string[] };
  }) => unknown;
}

const isHighlightModule = (value: unknown): value is HighlightModule =>
  typeof value === "object" &&
  value !== null &&
  "default" in value &&
  typeof value.default === "function";

let componentsPromise: Promise<Components> | undefined;
let components: Components | undefined;
let returnFocus: HTMLElement | null = null;
let highlightGeneration = 0;
const initializedPages = new WeakSet<HTMLElement>();
const initializedModals = new WeakSet<HTMLDialogElement>();
const getModal = () => document.querySelector<PagefindModal>("#site-search pagefind-modal");

const loadComponents = async () => {
  componentsPromise ??= import("@pagefind/component-ui");
  components = await componentsPromise;
  return components;
};

const searchPageUrl = (term: string) => {
  const params = new URLSearchParams();
  if (term.trim()) {
    params.set("q", term.trim());
  }
  return `/search${params.size ? `?${params}` : ""}`;
};

const updateModalSearchLink = (term: unknown) => {
  const link = getModal()?.querySelector<HTMLAnchorElement>("[data-search-page-link]");
  if (link && typeof term === "string") {
    link.href = searchPageUrl(term);
  }
};

const syncSearchLocation = (term: string) => {
  const url = new URL(window.location.href);
  if (term.trim()) {
    url.searchParams.set("q", term.trim());
  } else {
    url.searchParams.delete("q");
  }
  const backUrl = `${url.pathname}${url.search}`;
  history.replaceState(history.state, "", `${backUrl}${url.hash}`);
  window.navigationState?.setBackUrl(backUrl);
};

const showSearchError = (container: HTMLElement) => {
  if (container.querySelector(".search-error")) {
    return;
  }
  const message = document.createElement("p");
  message.className = "search-error";
  message.setAttribute("role", "status");
  message.textContent = "Search is unavailable. Please try again later.";
  container.append(message);
};

const openSearch = async (trigger: HTMLElement | null) => {
  const modal = getModal();
  try {
    const module = await loadComponents();
    if (modal?.isConnected !== true || !modal.dialogEl || modal.isOpen) {
      return;
    }
    const instance = module.getInstanceManager().getInstance("site-search");
    if (!initializedModals.has(modal.dialogEl)) {
      initializedModals.add(modal.dialogEl);
      instance.on("search", updateModalSearchLink, modal);
      modal.dialogEl.addEventListener("close", () => {
        document.querySelector("[data-search-trigger]")?.setAttribute("aria-expanded", "false");
        if (returnFocus !== null && returnFocus.isConnected) {
          returnFocus.focus();
        }
        returnFocus = null;
      });
    }
    updateModalSearchLink(instance.searchTerm);
    returnFocus =
      trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const headerTrigger = document.querySelector("[data-search-trigger]");
    headerTrigger?.setAttribute("aria-expanded", "true");
    headerTrigger?.setAttribute("aria-controls", modal.dialogEl.id);
    modal.open();
  } catch {
    if (modal?.isConnected === true) {
      window.location.assign("/search");
    }
  }
};

const clearHighlights = () => {
  for (const mark of document.querySelectorAll("#article mark.pagefind-highlight")) {
    const parent = mark.parentNode;
    mark.replaceWith(...mark.childNodes);
    parent?.normalize();
  }
};

const highlightTerms = async () => {
  highlightGeneration += 1;
  const generation = highlightGeneration;
  clearHighlights();
  const article = document.querySelector<HTMLElement>("#article");
  if (!article || !new URLSearchParams(window.location.search).has("highlight")) {
    return null;
  }
  try {
    const bundle = "/pagefind/pagefind-highlight.js";
    const module: unknown = await import(
      /* @vite-ignore */
      bundle
    );
    if (!isHighlightModule(module) || generation !== highlightGeneration || !article.isConnected) {
      return null;
    }
    return new module.default({
      addStyles: false,
      highlightParam: "highlight",
      markContext: article,
      markOptions: {
        className: "pagefind-highlight",
        exclude: ["[data-pagefind-ignore]", "[data-pagefind-ignore] *", "pre", "pre *", "code"]
      }
    });
  } catch {
    // The generated highlight bundle is absent until the first local build.
    return null;
  }
};

const initSearchPage = async () => {
  const page = document.querySelector<HTMLElement>("#pagefind-search");
  if (!page || initializedPages.has(page)) {
    return;
  }
  try {
    const module = await loadComponents();
    if (!page.isConnected || initializedPages.has(page)) {
      return;
    }
    initializedPages.add(page);
    const instance = module.getInstanceManager().getInstance("search-page");
    instance.on(
      "search",
      (term) => {
        if (typeof term === "string" && page.isConnected) {
          syncSearchLocation(term);
        }
      },
      page
    );
    const query = new URLSearchParams(window.location.search).get("q");
    if (query !== null && query !== "") {
      instance.triggerSearch(query);
    }
  } catch {
    showSearchError(page);
  }
};

const initSearch = () => {
  void initSearchPage();
  void highlightTerms();
};

document.addEventListener("input", (event) => {
  const { target } = event;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  if (target.closest("#pagefind-search")) {
    syncSearchLocation(target.value);
  }
  if (target.closest("#site-search")) {
    updateModalSearchLink(target.value);
  }
});

document.addEventListener(
  "click",
  (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const trigger = event.target.closest<HTMLElement>("[data-search-trigger]");
    if (
      trigger &&
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      void openSearch(trigger);
    }
    if (event.target.closest("[data-search-close]")) {
      getModal()?.close();
    }
    if (event.target.closest("#site-search pagefind-results a")) {
      const input = getModal()?.querySelector<HTMLInputElement>("input");
      window.navigationState?.setBackUrl(searchPageUrl(input?.value ?? ""));
    }
  },
  { capture: true }
);

document.addEventListener("keydown", (event) => {
  if (
    event.defaultPrevented ||
    event.key.toLowerCase() !== "k" ||
    (!event.metaKey && !event.ctrlKey) ||
    event.altKey
  ) {
    return;
  }
  const { target } = event;
  if (
    target instanceof HTMLElement &&
    (target.matches("input, textarea, select") || target.isContentEditable)
  ) {
    return;
  }
  if (!document.querySelector("[data-search-trigger]")) {
    return;
  }
  event.preventDefault();
  void openSearch(document.activeElement instanceof HTMLElement ? document.activeElement : null);
});

document.addEventListener("astro:before-swap", () => {
  highlightGeneration += 1;
  returnFocus = null;
  getModal()?.close?.();
  clearHighlights();
  if (components) {
    const manager = components.getInstanceManager();
    manager.removeInstance("site-search");
    manager.removeInstance("search-page");
  }
});
document.addEventListener("astro:page-load", initSearch);
initSearch();
