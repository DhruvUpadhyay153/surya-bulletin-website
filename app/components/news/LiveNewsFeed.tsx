"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import type { News } from "../../types/news";
import NewsCard from "./NewsCard";

// Firestore Timestamp ya date value ko JavaScript Date mein convert karta hai.
function convertToDate(value: unknown): Date | null {
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const timestamp = value as { toDate?: () => Date };

    if (typeof timestamp.toDate === "function") {
      const date = timestamp.toDate();
      return !Number.isNaN(date.getTime()) ? date : null;
    }
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

// News ki date Hindi format mein dikhata hai.
function formatNewsDate(value: unknown): string {
  const date = convertToDate(value);

  if (!date) {
    return "ताज़ा अपडेट";
  }

  return date.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Existing tags aur state se category select karta hai.
function getNewsCategory(data: Record<string, unknown>): string {
  const tags = Array.isArray(data.tags)
    ? data.tags.filter(
        (tag): tag is string => typeof tag === "string",
      )
    : [];

  const specificTag = tags.find(
    (tag) =>
      !["latest", "breaking", "for you"].includes(
        tag.toLowerCase(),
      ),
  );

  if (specificTag) {
    return specificTag;
  }

  if (
    typeof data.state === "string" &&
    data.state.trim() !== "" &&
    data.state.toLowerCase() !== "all"
  ) {
    return data.state;
  }

  return "न्यूज़";
}

export default function LiveNewsFeed() {
  const [stories, setStories] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.info("[Surya Bulletin] Starting Firestore listener...");

    // Diagnostic query: pehle 50 documents bina server-side filter ke read honge.
    const newsQuery = query(
      collection(db, "news"),
      limit(50),
    );

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        console.info(
          "[Surya Bulletin] Total Firestore documents received:",
          snapshot.size,
        );

        // Actual Firestore fields verify karne ke liye.
        console.table(
          snapshot.docs.map((document) => {
            const data = document.data();

            return {
              documentId: document.id,
              published: data.published,
              status: data.status,
              title: data.title,
              hasImageUrl:
                typeof data.imageUrl === "string" &&
                data.imageUrl.trim() !== "",
              createdAt: data.createdAt,
            };
          }),
        );

        // Existing schema ke mutabik published documents select karte hain.
        const matchingDocuments = snapshot.docs.filter((document) => {
          const data = document.data();

          return (
            data.published === true &&
            data.status === "published"
          );
        });

        console.info(
          "[Surya Bulletin] Documents matching published conditions:",
          matchingDocuments.length,
        );

        // Published documents ko NewsCard ke expected format mein convert karte hain.
        const fetchedStories: News[] = matchingDocuments.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            slug: document.id,

            title:
              typeof data.title === "string"
                ? data.title
                : "शीर्षक उपलब्ध नहीं",

            excerpt:
              typeof data.description === "string"
                ? data.description
                : "",

            image:
              typeof data.imageUrl === "string" &&
              data.imageUrl.trim() !== ""
                ? data.imageUrl
                : "/images/article-app.jpg",

            category: getNewsCategory(data),

            publishedAt: formatNewsDate(data.createdAt),
          };
        });

        // Newest news pehle.
        fetchedStories.sort((a, b) => {
          const aDate = convertToDate(
            snapshot.docs
              .find((document) => document.id === a.id)
              ?.data().createdAt,
          );

          const bDate = convertToDate(
            snapshot.docs
              .find((document) => document.id === b.id)
              ?.data().createdAt,
          );

          return (
            (bDate?.getTime() ?? 0) -
            (aDate?.getTime() ?? 0)
          );
        });

        setStories(fetchedStories);
        setError(null);
        setLoading(false);
      },
      (firebaseError) => {
        console.error(
          "[Surya Bulletin] Firestore query failed:",
          firebaseError.code,
          firebaseError.message,
        );

        setError(
          `खबरें लोड नहीं हो सकीं। Error: ${firebaseError.code}`,
        );

        setLoading(false);
      },
    );

    return () => {
      console.info("[Surya Bulletin] Stopping Firestore listener.");
      unsubscribe();
    };
  }, []);

  return (
    <section id="latest" className="wrap latest-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">लेटेस्ट अपडेट्स</span>
          <h2>
            ताज़ा खबरें <span className="red-period">.</span>
          </h2>
        </div>

        <span className="text-link">Surya Bulletin</span>
      </div>

      {loading && (
        <p className="empty-state" role="status">
          ताज़ा खबरें लोड हो रही हैं...
        </p>
      )}

      {!loading && error && (
        <p className="empty-state" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && stories.length > 0 && (
        <div className="story-grid">
          {stories.map((story, index) => (
            <NewsCard
              key={story.id}
              story={story}
              index={index}
            />
          ))}
        </div>
      )}

      {!loading && !error && stories.length === 0 && (
        <p className="empty-state">
          अभी कोई प्रकाशित खबर उपलब्ध नहीं है।
        </p>
      )}
    </section>
)}