const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

export function GET() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api",
    "Disallow: /admin",
    `Sitemap: ${sitemapUrl}`,
  ];

  return new Response(lines.join("\n"), {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
