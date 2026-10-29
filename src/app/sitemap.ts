import { MetadataRoute } from "next";
import { SEO_RESUME_EXAMPLES } from "@/data/seo-resume-examples";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://launchpad-app-ashy.vercel.app";
  const defaultDate = new Date("2026-10-29T12:00:00Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: defaultDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/examples`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scanner`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cover-letter`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/follow-ups`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const exampleRoutes: MetadataRoute.Sitemap = SEO_RESUME_EXAMPLES.map((ex) => ({
    url: `${baseUrl}/examples/${ex.slug}`,
    lastModified: defaultDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...exampleRoutes];
}
