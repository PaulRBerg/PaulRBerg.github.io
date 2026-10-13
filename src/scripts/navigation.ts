const BACK_URL_STORAGE_KEY = "backUrl";
let backUrl: string | null = null;
try {
  backUrl = sessionStorage.getItem(BACK_URL_STORAGE_KEY);
} catch {
  // Keep navigation state in memory when browser storage is unavailable.
}

const getBackUrlFromPage = () =>
  document.querySelector<HTMLElement>("[data-back-url]")?.dataset.backUrl;

const syncBackButton = () => {
  const backButton = document.querySelector<HTMLAnchorElement>("[data-back-button]");

  if (backButton && backUrl !== null && backUrl !== "") {
    backButton.href = backUrl;
  }
};

const setBackUrl = (url: string) => {
  backUrl = url;
  try {
    sessionStorage.setItem(BACK_URL_STORAGE_KEY, url);
  } catch {
    // The current navigation still retains its return destination.
  }
  syncBackButton();
};

const syncNavigationState = () => {
  const pageBackUrl = getBackUrlFromPage();

  if (pageBackUrl !== undefined && pageBackUrl !== "") {
    setBackUrl(pageBackUrl);
    return;
  }

  syncBackButton();
};

window.navigationState = {
  setBackUrl,
  syncBackButton,
  syncNavigationState
};

document.addEventListener("astro:page-load", syncNavigationState);
syncNavigationState();
