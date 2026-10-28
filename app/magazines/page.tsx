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
import styles from "./Magazines.module.css";

interface Magazine {
  id: string;
  title: string;
  coverImageUrl: string;
  published: boolean;
  createdAt?: {
    seconds?: number;
    toDate?: () => Date;
  } | Date | string;
}

function getDate(value: Magazine["createdAt"]): Date | null {
  if (!value) return null;

  if (value instanceof Date) return value;

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

function formatDate(value: Magazine["createdAt"]): string {
  const date = getDate(value);

  if (!date) return "तारीख उपलब्ध नहीं";

  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function MagazinesPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchMagazines() {
      try {
        setLoading(true);
        setError("");

        const magazinesQuery = query(
          collection(db, "magazines"),
          where("published", "==", true),
        );

        const snapshot = await getDocs(magazinesQuery);

        const items: Magazine[] = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            title:
              typeof data.title === "string"
                ? data.title
                : "Surya Bulletin Magazine",
            coverImageUrl:
              typeof data.coverImageUrl === "string"
                ? data.coverImageUrl
                : "",
            published: data.published === true,
            createdAt: data.createdAt,
          };
        });

        items.sort((a, b) => {
          const dateA = getDate(a.createdAt)?.getTime() ?? 0;
          const dateB = getDate(b.createdAt)?.getTime() ?? 0;

          return dateB - dateA;
        });

        if (active) {
          setMagazines(items);
        }
      } catch (err) {
        console.error("Magazine fetch error:", err);

        if (active) {
          setError(
            "मैगज़ीन लोड नहीं हो पाईं। कृपया कुछ देर बाद दोबारा कोशिश करें।",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchMagazines();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            SURYA BULLETIN · DIGITAL MAGAZINE
          </span>

         <div className={styles.heroTitle}>
  <Image
    src="/images/logo.png"
    alt="Surya Bulletin logo"
    width={76}
    height={76}
    priority
    className={styles.heroLogo}
  />
  <h1>मैगज़ीन</h1>
</div>

          <p>
            विचार, खबरें और खास कहानियाँ — अब डिजिटल मैगज़ीन के रूप में।
            अपनी पसंद का संस्करण चुनें और पढ़ना शुरू करें।
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionEyebrow}>OUR MAGAZINES</span>
            <h2>मैगज़ीन संस्करण</h2>
            <p>हमारी प्रकाशित मैगज़ीन यहाँ पढ़ें।</p>
          </div>

          {!loading && !error && (
            <span className={styles.count}>
              {magazines.length} मैगज़ीन
            </span>
          )}
        </div>

        {loading ? (
          <div className={styles.statusBox}>
            <span className={styles.loader} />
            <p>मैगज़ीन लोड हो रही हैं...</p>
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
        ) : magazines.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>▤</div>
            <h3>अभी कोई मैगज़ीन उपलब्ध नहीं है</h3>
            <p>नई मैगज़ीन प्रकाशित होने पर यहाँ दिखाई देगी।</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {magazines.map((magazine, index) => (
              <article className={styles.card} key={magazine.id}>
                <Link
                  href={`/magazines/${encodeURIComponent(magazine.id)}`}
                  className={styles.coverLink}
                  aria-label={`${magazine.title} पढ़ें`}
                >
                  <div className={styles.cover}>
                    {magazine.coverImageUrl ? (
                      <Image
                        src={magazine.coverImageUrl}
                        alt={`${magazine.title} का कवर`}
                        className={styles.coverImage}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className={styles.coverPlaceholder}>
                        <span className={styles.placeholderLogo}>SB</span>
                        <span>SURYA BULLETIN</span>
                        <strong>{magazine.title}</strong>
                        <span className={styles.placeholderCaption}>
                          DIGITAL MAGAZINE
                        </span>
                      </div>
                    )}

                    <span className={styles.readBadge}>पढ़ें ↗</span>
                  </div>
                </Link>

                <div className={styles.cardBody}>
                  <span className={styles.cardDate}>
                    {formatDate(magazine.createdAt)}
                  </span>

                  <h3>{magazine.title}</h3>

                  <Link
                    href={`/magazines/${encodeURIComponent(magazine.id)}`}
                    className={styles.readLink}
                  >
                    पूरी मैगज़ीन पढ़ें
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