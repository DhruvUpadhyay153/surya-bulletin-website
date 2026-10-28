import type { MetadataRoute } from "next";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "./lib/firebase";

// Website ka permanent production domain.
const BASE_URL = "https://suryabulletin.in";

// Website ke fixed pages.
const STATIC_ROUTES = [
  "",
  "/latest-news",
  "/category/desh-duniya",
  "/category/politics",
  "/uttar-pradesh",
  "/ghaziabad",
  "/crime",
  "/entertainment",
  "/dharma",
  "/e-paper",
  "/magazine",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fixed pages sitemap mein add karte hain.
  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      changeFrequency: route === "" ? "daily" : "hourly",
      priority: route === "" ? 1 : 0.8,
    }),
  );

  try {
    // Published news ke Firebase documents fetch karte hain.
    const publishedNewsQuery = query(
      collection(db, "news"),
      where("published", "==", true),
      where("status", "==", "published"),
      limit(1000),
    );

    const snapshot = await getDocs(publishedNewsQuery);

    // Har published news ke liye article URL banate hain.
    const newsPages: MetadataRoute.Sitemap = snapshot.docs.map(
      (document) => {
        const data = document.data();

        // Current website ka article route /news/[id] hai.
        const articleUrl = `${BASE_URL}/news/${encodeURIComponent(
          document.id,
        )}`;

        // createdAt available ho toh usko lastModified banate hain.
        const createdAt = data.createdAt;

        let lastModified: Date | undefined;

        if (
          createdAt &&
          typeof createdAt === "object" &&
          typeof createdAt.toDate === "function"
        ) {
          lastModified = createdAt.toDate();
        } else if (
          typeof createdAt === "string" ||
          typeof createdAt === "number"
        ) {
          const parsedDate = new Date(createdAt);

          if (!Number.isNaN(parsedDate.getTime())) {
            lastModified = parsedDate;
          }
        }

        return {
          url: articleUrl,
          ...(lastModified ? { lastModified } : {}),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      },
    );

    return [...staticPages, ...newsPages];
  } catch (error) {
    // Firebase error hone par kam-se-kam fixed pages available rahenge.
    console.error("[Surya Bulletin] Sitemap news fetch failed:", error);

    return staticPages;
  }
}