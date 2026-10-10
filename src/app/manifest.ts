import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kucing Jakarta",
    short_name: "Kucing",
    description: "Koleksi foto kucing Nadya di sekitar Jakarta",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#f07b1d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
