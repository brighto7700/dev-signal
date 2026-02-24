export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://devterminal.vercel.app/sitemap.xml",
  };
}
