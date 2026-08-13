import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const paths = [
  "/",
  "/biography",
  "/timeline",
  "/documentaries",
  "/gallery",
  "/archive",
  "/lessons",
  "/tributes",
  "/about",
  "/contact",
  "/privacy",
  "/terms"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7
  }));
}
