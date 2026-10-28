"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import styles from "./Epaper.module.css";

interface Epaper {
  id: string;
  title: string;
  coverImageUrl: string;
  published: boolean;
  createdAt?: {
    seconds?: number;
    toDate?: () => Date;
  } | Date | string;
}

function getDate(value: Epaper["createdAt"]): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }

  return null;
}

function formatDate(value: Epaper["createdAt"]): string {
  const date = getDate(value);

  if (!date) return "तारीख उपलब्ध नहीं";

  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function EpaperPage() {
  const [epapers, setEpapers] = useState<Epaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchEpapers() {
      try {
        setLoading(true);
        setError("");

        const epapersQuery = query(
          collection(db, "epapers"),
          where("published", "==", true),
        );

        const snapshot = await getDocs(epapersQuery);

        const items: Epaper[] = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            title:
              typeof data.title === "string"
                ? data.title
                : "Surya Bulletin E-Paper",
            coverImageUrl:
              typeof data.coverImageUrl === "string"
                ? data.coverImageUrl
                : "",
            published: data.published === true,
            createdAt: data.createdAt,
          };
        });

        // Newest papers first.
        items.sort((a, b) => {
          const dateA = getDate(a.createdAt)?.getTime() ?? 0;
          const dateB = getDate(b.createdAt)?.getTime() ?? 0;

          return dateB - dateA;
        });

        if (active) {
          setEpapers(items);
        }
      } catch (err) {
        console.error("E-Paper fetch error:", err);

        if (active) {
          setError(
            "ई-पेपर लोड नहीं हो पाए। कृपया कुछ देर बाद दोबारा कोशिश करें।",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchEpapers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            SURYA BULLETIN · DIGITAL EDITION
          </span>

          <h1>ई-पेपर</h1>

          <p>
            अखबार का वही भरोसा, अब आपकी स्क्रीन पर।
            आज का संस्करण पढ़ें और पिछले संस्करण भी देखें।
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionEyebrow}>
              OUR NEWSPAPER
            </span>
            <h2>ई-पेपर संस्करण</h2>
            <p>उपलब्ध समाचार पत्रों के संस्करण यहाँ देखें।</p>
          </div>

          {!loading && !error && (
            <span className={styles.count}>
              {epapers.length} संस्करण
            </span>
          )}
        </div>

        {loading ? (
          <div className={styles.statusBox}>
            <span className={styles.loader} />
            <p>ई-पेपर लोड हो रहे हैं...</p>
          </div>
        ) : error ? (
          <div className={styles.statusBox}>
            <p className={styles.errorText}>{error}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              दोबारा कोशिश करें
            </button>
          </div>
        ) : epapers.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>▤</div>
            <h3>अभी कोई ई-पेपर उपलब्ध नहीं है</h3>
            <p>
              नए संस्करण प्रकाशित होने पर वे यहाँ दिखाई देंगे।
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {epapers.map((epaper, index) => (
              <article
                className={styles.card}
                key={epaper.id}
              >
                <Link
                  href={`/e-paper/${encodeURIComponent(epaper.id)}`}
                  className={styles.coverLink}
                  aria-label={`${epaper.title} पढ़ें`}
                >
                  <div className={styles.cover}>
                    {epaper.coverImageUrl ? (
                      <Image
                        src={epaper.coverImageUrl}
                        alt={`${epaper.title} का कवर`}
                        className={styles.coverImage}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className={styles.coverPlaceholder}>
                        <span className={styles.placeholderLogo}>
                          SB
                        </span>
                        <span>SURYA BULLETIN</span>
                        <strong>{epaper.title}</strong>
                        <span className={styles.placeholderCaption}>
                          DIGITAL NEWSPAPER
                        </span>
                      </div>
                    )}

                    <span className={styles.readBadge}>
                      पढ़ें ↗
                    </span>
                  </div>
                </Link>

                <div className={styles.cardBody}>
                  <span className={styles.cardDate}>
                    {formatDate(epaper.createdAt)}
                  </span>

                  <h3>{epaper.title}</h3>

                  <Link
                    href={`/e-paper/${encodeURIComponent(epaper.id)}`}
                    className={styles.readLink}
                  >
                    पूरा ई-पेपर पढ़ें
                    <span aria-hidden="true"> → </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}