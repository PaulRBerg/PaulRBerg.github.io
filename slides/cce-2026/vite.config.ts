export default {
  plugins: [
    {
      name: "presentation-base",
      transformIndexHtml(html: string) {
        const description =
          /<meta property="og:description" content="(?<description>[^"]*)"\s*\/?>/u.exec(html)
            ?.groups?.description;
        const cleanHTML =
          description === undefined
            ? html
            : html.replace(
                /<meta name="description" content="[^"]*"\s*\/?>/u,
                () => `<meta name="description" content="${description}">`,
              );
        return cleanHTML.replace(
          "<head>",
          `<head>
<base href="/presentations/cce-2026/">
<link rel="canonical" href="https://prberg.com/presentations/cce-2026/">
<link rel="help" type="text/plain" href="/llms.txt" title="Site guide for language models">
<meta property="og:url" content="https://prberg.com/presentations/cce-2026/">
<meta property="og:type" content="website">`,
        );
      },
    },
  ],
};
