(() => {
  if (!["prberg.com", "www.prberg.com"].includes(window.location.hostname)) {
    return;
  }

  const measurementId = "G-TJ49HZ4TM9";
  /** @type {Window & { dataLayer?: IArguments[] }} */
  const analyticsWindow = window;
  analyticsWindow.dataLayer ??= [];
  const { dataLayer } = analyticsWindow;
  const gtag = function gtag() {
    // Google tag commands use the Arguments object, not a dataLayer event object.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };

  gtag("js", new Date());
  // The stream's enhanced measurement tracks page loads and browser history changes.
  gtag("config", measurementId);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
})();
