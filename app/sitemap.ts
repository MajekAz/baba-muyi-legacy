import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const paths = [
  "/",
  "/biography",
  "/timeline",
  "/documentaries",
  "/gallery",
  "/archive",
  "/documents",
  "/bolekaja",
  "/tioluwa-lase-molue",
  "/journey-map",
  "/family-tree",
  "/lessons",
  "/tributes",
  "/blog",
  "/curator",
  "/contact",
  "/privacy",
  "/terms",
  "/waiting-list"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7
  }));
}
