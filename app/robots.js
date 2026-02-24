export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://shellsignal.vercel.app/sitemap.xml",
  };
}
