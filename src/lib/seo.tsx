import type { Metadata } from "next";

export function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `https://dudhwala.ideasprout.in${path}`;
  const imageUrl = image || "https://dudhwala.ideasprout.in/logo.png";

  const defaultKeywords = [
    "dudhwala",
    "dairy vendor software India",
    "milk delivery management system",
    "dairy business digitalization",
    "hyperlocal dairy platform",
    "milk subscription management",
  ];
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return {
    title: `${title} | Dudhwala`,
    description,
    keywords: allKeywords,
    authors: [{ name: "Dudhwala" }],
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: "Dudhwala",
      images: [{ url: imageUrl, width: 800, height: 600, alt: title }],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
