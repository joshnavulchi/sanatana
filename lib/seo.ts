import { Metadata } from "next";

type SEOOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Sanatana";

function absoluteUrl(path = "/") {
  if (!path) return SITE_URL + "/";
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

export function generateSEO(opts: SEOOptions): Metadata {
  const title = opts.title ? `${opts.title} | ${SITE_NAME}` : SITE_NAME;
  const description = opts.description || "";
  const url = absoluteUrl(opts.path || "/");

  const images = opts.image ? [{ url: opts.image }] : undefined;

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images,
      type: "website",
    },
    twitter: {
      title,
      description,
      images: images ? images.map((i) => String(i.url)) : undefined,
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
  };

  if (opts.keywords && opts.keywords.length) {
    // `keywords` isn't a first-class field on next Metadata yet but it's safe
    // to attach for downstream usage and minor search engines.
    // Put under `other` to avoid typing conflicts.
     
    // @ts-ignore
    metadata.other = { keywords: opts.keywords.join(", ") };
  }

  return metadata;
}

export { absoluteUrl };
