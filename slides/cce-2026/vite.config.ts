export default {
  plugins: [
    {
      name: "presentation-base",
      transformIndexHtml(html: string) {
        return html.replace("<head>", '<head>\n<base href="/presentations/cce-2026/">');
      }
    }
  ]
};
