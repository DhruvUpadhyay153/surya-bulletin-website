"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import styles from "./NewsListing.module.css";

type FilterMode = "all" | "state" | "keyword" | "tag";

interface NewsListingProps {
  title: string;
  description: string;
  filterMode?: FilterMode;
  filterTerms?: string[];
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  state: string;
  createdAt: unknown;
}

function getDate(value: unknown): Date | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();

    return date instanceof Date && !Number.isNaN(date.getTime())
      ? date
      : null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function formatDate(value: unknown): string {
  const date = getDate(value);

  if (!date) return "ताज़ा खबर";

  return date.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalize(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("hi-IN").trim();
}

export default function NewsListing({
  title,
  description,
  filterMode = "all",
  filterTerms = [],
}: NewsListingProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const newsQuery = query(collection(db, "news"), limit(200));

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        const publishedNews: NewsItem[] = snapshot.docs
          .filter((document) => {
            const data = document.data();

            return (
              data.published === true &&
              data.status === "published"
            );
          })
          .map((document) => {
            const data = document.data();

            const rawTags = Array.isArray(data.tags)
              ? data.tags
              : [];

            return {
              id: document.id,
              title:
                typeof data.title === "string"
                  ? data.title
                  : "",
              description:
                typeof data.description === "string"
                  ? data.description
                  : "",
              imageUrl:
                typeof data.imageUrl === "string"
                  ? data.imageUrl
                  : "",
              tags: rawTags.filter(
                (tag: unknown): tag is string =>
                  typeof tag === "string",
              ),
              state:
                typeof data.state === "string"
                  ? data.state
                  : "",
              createdAt: data.createdAt,
            };
          })
          .sort((a, b) => {
            const dateA = getDate(a.createdAt)?.getTime() ?? 0;
            const dateB = getDate(b.createdAt)?.getTime() ?? 0;

            return dateB - dateA;
          });

        setNews(publishedNews);
        setLoading(false);
        setError(false);
      },
      (err) => {
        console.error(
          "[Surya Bulletin] News loading failed:",
          err,
        );

        setError(true);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredNews = useMemo(() => {
    if (filterMode === "all" || filterTerms.length === 0) {
      return news;
    }

    const terms = filterTerms.map(normalize);

    return news.filter((item) => {
      const titleText = normalize(item.title);
      const descriptionText = normalize(item.description);
      const stateText = normalize(item.state);
      const tagTexts = item.tags.map(normalize);

      if (filterMode === "state") {
        return terms.some(
          (term) =>
            stateText === term ||
            stateText.includes(term),
        );
      }

      if (filterMode === "tag") {
        return tagTexts.some((tag) =>
          terms.some(
            (term) => tag === term || tag.includes(term),
          ),
        );
      }

      if (filterMode === "keyword") {
        return terms.some(
          (term) =>
            titleText.includes(term) ||
            descriptionText.includes(term) ||
            stateText.includes(term) ||
            tagTexts.some((tag) => tag.includes(term)),
        );
      }

      return true;
    });
  }, [news, filterMode, filterTerms]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            SURYA BULLETIN
          </span>

          <h1>{title}</h1>

          <p>{description}</p>

          <div className={styles.headingLine} />
        </header>

        {loading && (
          <p className={styles.message} role="status">
            खबरें लोड हो रही हैं...
          </p>
        )}

        {error && (
          <div className={styles.message} role="alert">
            <h2>खबरें लोड नहीं हो सकीं।</h2>
            <p>
              कृपया इंटरनेट कनेक्शन जाँचें और पेज दोबारा खोलें।
            </p>
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className={styles.message}>
            <h2>अभी कोई प्रकाशित खबर उपलब्ध नहीं है।</h2>
            <p>नई खबरें प्रकाशित होने पर यहाँ दिखाई देंगी।</p>
          </div>
        )}

        {!loading && !error && filteredNews.length > 0 && (
          <>
            <div className={styles.resultsBar}>
              <span>ताज़ा अपडेट</span>
              <span>{filteredNews.length} खबरें</span>
            </div>

            <section
              className={styles.grid}
              aria-label={title}
            >
              {filteredNews.map((item, index) => (
                <article
                  className={styles.card}
                  key={item.id}
                >
                  <Link
                    href={`/news/${encodeURIComponent(item.id)}`}
                    className={styles.imageLink}
                    aria-label={`${item.title} पढ़ें`}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        className={styles.image}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div
                        className={styles.imagePlaceholder}
                        aria-hidden="true"
                      >
                        <span>सूर्य बुलेटिन</span>
                      </div>
                    )}
                  </Link>

                  <div className={styles.cardBody}>
                    {item.tags.length > 0 && (
                      <span className={styles.category}>
                        {item.tags[0]}
                      </span>
                    )}

                    <h2>
                      <Link
                        href={`/news/${encodeURIComponent(item.id)}`}
                      >
                        {item.title}
                      </Link>
                    </h2>

                    {item.description && (
                      <p className={styles.excerpt}>
                        {item.description}
                      </p>
                    )}

                    <div className={styles.cardFooter}>
                      <time
                        dateTime={
                          getDate(item.createdAt)?.toISOString()
                        }
                      >
                        {formatDate(item.createdAt)}
                      </time>

                      <Link
                        href={`/news/${encodeURIComponent(item.id)}`}
                        className={styles.readMore}
                        aria-label={`${item.title} पूरी पढ़ें`}
                      >
                        पूरी खबर पढ़ें →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}