export default {
  plugins: [
    {
      name: "presentation-base",
      transformIndexHtml(html: string) {
        return html.replace("<head>", '<head>\n<base href="/presentations/frontiers-2026/">');
      }
    }
  ]
};
