// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://radarcripto.space/", lastModified: new Date() },
    { url: "https://radarcripto.space/about", lastModified: new Date() },
    { url: "https://radarcripto.space/simulator", lastModified: new Date() },
  ];
}
