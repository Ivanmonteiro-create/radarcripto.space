import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://radarcripto.space";
  return [
    { url: `${base}/`, priority: 1, changefreq: "weekly" },
    { url: `${base}/simulador`, priority: 0.9, changefreq: "daily" },
    { url: `${base}/planos`, priority: 0.6, changefreq: "monthly" },
  ];
}
