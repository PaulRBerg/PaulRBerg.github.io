import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const themeSource = readFileSync(new URL("theme.ts", import.meta.url), "utf-8");
const navigationSource = readFileSync(new URL("navigation.ts", import.meta.url), "utf-8");
const layoutSource = readFileSync(new URL("../layouts/Layout.astro", import.meta.url), "utf-8");
const bootstrap = /<script is:inline>(?<source>[\s\S]*?)<\/script>/u.exec(layoutSource)?.groups
  ?.source;
assert.notEqual(bootstrap, undefined);
const compile = (source: string) => ts.transpileModule(source, {}).outputText;

const blockedStorage = {
  getItem: () => {
    throw new Error("Storage access denied");
  },
  setItem: () => {
    throw new Error("Storage access denied");
  }
};

const setupTheme = (preference: string | null, blocked = false) => {
  const documentListeners = new Map<string, () => void>();
  const buttonListeners = new Map<string, () => void>();
  const mediaListeners = new Map<string, (event: { matches: boolean }) => void>();
  const button = {
    addEventListener: (event: string, listener: () => void) => {
      buttonListeners.set(event, listener);
    },
    dataset: {} as Record<string, string>,
    setAttribute: () => {}
  };
  const document = {
    addEventListener: (event: string, listener: () => void) => {
      documentListeners.set(event, listener);
    },
    documentElement: { dataset: {} as Record<string, string> },
    querySelector: (selector: string) => (selector === "#theme-btn" ? button : null)
  };
  const media = {
    addEventListener: (event: string, listener: (event: { matches: boolean }) => void) => {
      mediaListeners.set(event, listener);
    },
    matches: false
  };
  const writes: string[] = [];
  const localStorage = blocked
    ? blockedStorage
    : {
        getItem: () => preference,
        setItem: (_key: string, value: string) => {
          writes.push(value);
        }
      };
  const context = { document, localStorage, window: { matchMedia: () => media } };
  runInNewContext(`${bootstrap}\n${compile(themeSource)}`, context);
  return { buttonListeners, document, documentListeners, mediaListeners, writes };
};

await test("theme bootstrap and controls work when storage is unavailable", () => {
  const state = setupTheme(null, true);
  assert.equal(state.document.documentElement.dataset.theme, "light");
  state.buttonListeners.get("click")?.();
  assert.equal(state.document.documentElement.dataset.theme, "dark");
  state.documentListeners.get("astro:after-swap")?.();
  assert.equal(state.document.documentElement.dataset.theme, "dark");
  state.mediaListeners.get("change")?.({ matches: false });
  assert.equal(state.document.documentElement.dataset.theme, "dark");
});

await test("system theme changes preserve a stored explicit preference", () => {
  const state = setupTheme("dark");
  state.mediaListeners.get("change")?.({ matches: false });
  assert.equal(state.document.documentElement.dataset.theme, "dark");
  assert.deepEqual(state.writes, []);
});

await test("system theme changes follow the OS until the user chooses a theme", () => {
  const state = setupTheme(null);
  state.mediaListeners.get("change")?.({ matches: true });
  assert.equal(state.document.documentElement.dataset.theme, "dark");
  assert.deepEqual(state.writes, []);
  state.buttonListeners.get("click")?.();
  assert.equal(state.document.documentElement.dataset.theme, "light");
  assert.deepEqual(state.writes, ["light"]);
  state.mediaListeners.get("change")?.({ matches: true });
  assert.equal(state.document.documentElement.dataset.theme, "light");
});

await test("an invalid stored theme falls back to the system preference", () => {
  const state = setupTheme("invalid");
  assert.equal(state.document.documentElement.dataset.theme, "light");
  state.mediaListeners.get("change")?.({ matches: true });
  assert.equal(state.document.documentElement.dataset.theme, "dark");
});

const setupNavigation = (sessionStorage: typeof blockedStorage) => {
  const backButton = { href: "/" };
  const page = { dataset: { backUrl: "/posts" } };
  const window: {
    navigationState?: { setBackUrl: (url: string) => void; syncBackButton: () => void };
  } = {};
  runInNewContext(compile(navigationSource), {
    document: {
      addEventListener: () => {},
      querySelector: (selector: string) => (selector === "[data-back-button]" ? backButton : page)
    },
    sessionStorage,
    window
  });
  return { backButton, window };
};

await test("back navigation retains page and search destinations when storage is blocked", () => {
  const state = setupNavigation(blockedStorage);
  assert.equal(state.backButton.href, "/posts");
  state.window.navigationState?.setBackUrl("/search?q=astro");
  assert.equal(state.backButton.href, "/search?q=astro");
  state.backButton.href = "/";
  state.window.navigationState?.syncBackButton();
  assert.equal(state.backButton.href, "/search?q=astro");
});
