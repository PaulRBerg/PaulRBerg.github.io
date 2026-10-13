const BACK_URL_STORAGE_KEY = "backUrl";

const getBackUrlFromPage = () =>
  document.querySelector<HTMLElement>("[data-back-url]")?.dataset.backUrl;

const syncBackButton = () => {
  const backButton = document.querySelector<HTMLAnchorElement>("[data-back-button]");
  const backUrl = sessionStorage.getItem(BACK_URL_STORAGE_KEY);

  if (backButton && backUrl !== null && backUrl !== "") {
    backButton.href = backUrl;
  }
};

const setBackUrl = (backUrl: string) => {
  sessionStorage.setItem(BACK_URL_STORAGE_KEY, backUrl);
  syncBackButton();
};

const syncNavigationState = () => {
  const backUrl = getBackUrlFromPage();

  if (backUrl !== undefined && backUrl !== "") {
    setBackUrl(backUrl);
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
