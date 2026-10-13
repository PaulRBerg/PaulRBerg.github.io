const THEME = "theme";
const LIGHT = "light";
const DARK = "dark";

const getThemeValue = (): string =>
  window.theme?.themeValue ?? document.documentElement.dataset.theme ?? LIGHT;

let themeValue = getThemeValue();

const reflectPreference = (): void => {
  document.documentElement.dataset.theme = themeValue;
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  const body = document.querySelector("body");
  if (body) {
    const computedStyles = window.getComputedStyle(body);
    const bgColor = computedStyles.backgroundColor;
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", bgColor);
  }
};

const setPreference = (): void => {
  localStorage.setItem(THEME, themeValue);
  reflectPreference();
};

if (window.theme !== undefined && window.theme !== null) {
  window.theme.setPreference = setPreference;
  window.theme.reflectPreference = reflectPreference;
} else {
  window.theme = {
    getTheme: () => themeValue,
    reflectPreference,
    setPreference,
    setTheme: (val: string) => {
      themeValue = val;
    },
    themeValue
  };
}

reflectPreference();

const setThemeFeature = (): void => {
  themeValue = getThemeValue();
  reflectPreference();

  const themeButton = document.querySelector<HTMLButtonElement>("#theme-btn");

  if (!themeButton || themeButton.dataset.themeBound === "true") {
    return;
  }

  themeButton.dataset.themeBound = "true";
  themeButton.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });
};

setThemeFeature();
document.addEventListener("astro:after-swap", setThemeFeature);

document.addEventListener("astro:before-swap", (event) => {
  const bgColor = document.querySelector("meta[name='theme-color']")?.getAttribute("content");

  if (bgColor !== undefined && bgColor !== null && bgColor !== "") {
    event.newDocument.querySelector("meta[name='theme-color']")?.setAttribute("content", bgColor);
  }
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });
