import type { MetadataRoute } from "next";

import { seo, site } from "@/lib/content";

/**
 * PWA / web app manifest — improves install prompts and gives search engines a
 * clean name/description/icon set. Served at /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${seo.tagline}`,
    short_name: site.name,
    description: site.promise,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    icons: [
      {
        src: "/icon.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/dev-syndicate-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
