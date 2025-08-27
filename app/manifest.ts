import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RadarCripto.space",
    short_name: "RadarCripto",
    start_url: "/",
    display: "standalone",
    background_color: "#0f121e",
    theme_color: "#0f121e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
