import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { setImmediate as settle } from "node:timers/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("search.ts", import.meta.url), "utf-8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;

class MockElement {
  attributes = new Map<string, string>();
  isConnected = true;

  closest(selector: string) {
    return selector === "[data-search-trigger]" ? this : null;
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }
}

const setupSearch = () => {
  const listeners = new Map<string, (event: object) => void>();
  const trigger = new MockElement();
  const opened: string[] = [];
  const redirects: string[] = [];
  const makeModal = (id: string) => ({
    dialogEl: { addEventListener() {}, id },
    isConnected: true,
    isOpen: false,
    open: () => {
      opened.push(id);
    },
    querySelector: () => null
  });
  const originalModal = makeModal("original");
  let currentModal = originalModal;
  let importError: Error | undefined;
  runInNewContext(compiled, {
    Element: MockElement,
    HTMLElement: MockElement,
    document: {
      activeElement: trigger,
      addEventListener: (event: string, listener: (event: object) => void) => {
        listeners.set(event, listener);
      },
      querySelector: (selector: string) =>
        selector === "#site-search pagefind-modal" ? currentModal : null,
      querySelectorAll: () => []
    },
    exports: {},
    require: () => {
      if (importError !== undefined) {
        throw importError;
      }
      return {
        getInstanceManager: () => ({ getInstance: () => ({ on() {}, searchTerm: "" }) })
      };
    },
    window: { location: { assign: (url: string) => redirects.push(url) } }
  });
  const click = () => {
    listeners.get("click")?.({
      altKey: false,
      button: 0,
      ctrlKey: false,
      defaultPrevented: false,
      metaKey: false,
      preventDefault() {},
      shiftKey: false,
      target: trigger
    });
  };
  const navigate = () => {
    originalModal.isConnected = false;
    currentModal = makeModal("next");
  };
  const failImport = () => {
    importError = new Error("Import failed");
  };
  return { click, failImport, navigate, opened, redirects };
};

await test("search opens the clicked page's modal after its components load", async () => {
  const state = setupSearch();
  state.click();
  await settle();
  assert.deepEqual(state.opened, ["original"]);
  assert.deepEqual(state.redirects, []);
});

await test("a delayed search import cannot open a modal after navigation", async () => {
  const state = setupSearch();
  state.click();
  state.navigate();
  await settle();
  assert.deepEqual(state.opened, []);
  assert.deepEqual(state.redirects, []);
});

await test("a failed search import redirects only while its original page is active", async () => {
  const active = setupSearch();
  active.click();
  active.failImport();
  await settle();
  assert.deepEqual(active.redirects, ["/search"]);

  const stale = setupSearch();
  stale.click();
  stale.navigate();
  stale.failImport();
  await settle();
  assert.deepEqual(stale.redirects, []);
});
