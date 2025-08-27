// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://radarcripto.space";
  const now = new Date();

  return [
    { url: `${base}/`,            lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/simulador`,   lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/planos`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
