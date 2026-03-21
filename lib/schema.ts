export function generateWebPageSchema({
  url,
  name,
  description,
}: {
  url: string;
  name: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name,
    description,
  } as const;
}

export function generateArticleSchema({
  url,
  headline,
  authorName,
  datePublished,
  image,
}: {
  url: string;
  headline: string;
  authorName?: string;
  datePublished?: string;
  image?: string;
}) {
  const graph: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    url,
  };

  if (authorName) graph.author = { "@type": "Person", name: authorName };
  if (datePublished) graph.datePublished = datePublished;
  if (image) graph.image = image;

  return graph;
}

export function generateBreadcrumbList(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  } as const;
}
