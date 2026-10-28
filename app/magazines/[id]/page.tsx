"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import styles from "./MagazineReader.module.css";

interface Magazine {
  id: string;
  title: string;
  published: boolean;
  coverImageUrl: string;
}

interface MagazinePage {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

export default function MagazineReaderPage() {
  const params = useParams<{ id: string }>();
  const magazineId = params.id;

  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [pages, setPages] = useState<MagazinePage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchMagazine() {
      try {
        setLoading(true);
        setError("");

        const magazineRef = doc(db, "magazines", magazineId);
        const magazineSnapshot = await getDoc(magazineRef);

        if (!magazineSnapshot.exists()) {
          throw new Error("NOT_FOUND");
        }

        const magazineData = magazineSnapshot.data();

        if (magazineData.published !== true) {
          throw new Error("NOT_FOUND");
        }

        const magazineItem: Magazine = {
          id: magazineSnapshot.id,
          title:
            typeof magazineData.title === "string"
              ? magazineData.title
              : "Surya Bulletin Magazine",
          published: true,
          coverImageUrl:
            typeof magazineData.coverImageUrl === "string"
              ? magazineData.coverImageUrl
              : "",
        };

        const pagesQuery = query(
          collection(db, "magazines", magazineId, "pages"),
          orderBy("pageNumber", "asc"),
        );

        const pagesSnapshot = await getDocs(pagesQuery);

        const pageItems: MagazinePage[] = pagesSnapshot.docs
          .map((pageDoc) => {
            const data = pageDoc.data();

            return {
              id: pageDoc.id,
              imageUrl:
                typeof data.imageUrl === "string" ? data.imageUrl : "",
              pageNumber:
                typeof data.pageNumber === "number" ? data.pageNumber : 0,
            };
          })
          .filter((page) => page.imageUrl.length > 0)
          .sort((a, b) => {
            if (a.pageNumber === 0) return 1;
            if (b.pageNumber === 0) return -1;
            return a.pageNumber - b.pageNumber;
          });

        if (active) {
          setMagazine(magazineItem);
          setPages(pageItems);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Magazine reader fetch error:", err);

        if (active) {
          const message =
            err instanceof Error ? err.message : "";

          setError(
            message === "NOT_FOUND"
              ? "यह मैगज़ीन उपलब्ध नहीं है या प्रकाशित नहीं की गई है।"
              : "मैगज़ीन लोड नहीं हो पाई। कृपया दोबारा कोशिश करें।",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (magazineId) {
      fetchMagazine();
    }

    return () => {
      active = false;
    };
  }, [magazineId]);

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= pages.length) return;
      setCurrentIndex(index);
    },
    [pages.length],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "ArrowRight" &&
        currentIndex < pages.length - 1
      ) {
        setCurrentIndex((index) => Math.min(index + 1, pages.length - 1));
      }

      if (event.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((index) => Math.max(index - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, pages.length]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.statusBox}>
          <span className={styles.loader} />
          <p>मैगज़ीन लोड हो रही है...</p>
        </div>
      </main>
    );
  }

  if (error || !magazine) {
    return (
      <main className={styles.page}>
        <div className={styles.statusBox}>
          <h1>मैगज़ीन उपलब्ध नहीं है</h1>
          <p>{error || "यह मैगज़ीन अभी उपलब्ध नहीं है।"}</p>
          <Link href="/magazines" className={styles.backButton}>
            सभी मैगज़ीन देखें
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/magazines" className={styles.backLink}>
          ← सभी मैगज़ीन
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>
            SURYA BULLETIN · DIGITAL MAGAZINE
          </span>

          <h1>{magazine.title}</h1>

          {pages.length > 0 && (
            <p>
              पेज {currentIndex + 1} / {pages.length}
            </p>
          )}
        </header>

        {pages.length === 0 ? (
          <div className={styles.statusBox}>
            <h2>अभी पेज उपलब्ध नहीं हैं</h2>
            <p>इस मैगज़ीन के पेज अभी अपलोड नहीं किए गए हैं।</p>
          </div>
        ) : (
          <>
            <section className={styles.reader}>
              <div className={styles.toolbar}>
                <span>
                  पेज नंबर: {pages[currentIndex].pageNumber || currentIndex + 1}
                </span>

                <span className={styles.keyboardHint}>
                  कीबोर्ड से ← → दबाकर पेज बदलें
                </span>
              </div>

              <div className={styles.imageStage}>
                <img
  key={pages[currentIndex].id}
  src={pages[currentIndex].imageUrl}
  alt={`${magazine.title} — पेज ${
    pages[currentIndex].pageNumber || currentIndex + 1
  }`}
  className={styles.magazineImage}
  draggable={false}
/>
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  onClick={() => goToPage(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className={styles.controlButton}
                >
                  ← पिछला पेज
                </button>

                <span className={styles.pageCounter}>
                  {currentIndex + 1} / {pages.length}
                </span>

                <button
                  type="button"
                  onClick={() => goToPage(currentIndex + 1)}
                  disabled={currentIndex === pages.length - 1}
                  className={styles.controlButton}
                >
                  अगला पेज →
                </button>
              </div>
            </section>

            <section className={styles.thumbnailSection}>
              <h2>सभी पेज</h2>

              <div className={styles.thumbnailGrid}>
                {pages.map((page, index) => (
                  <button
                    type="button"
                    key={page.id}
                    onClick={() => goToPage(index)}
                    className={`${styles.thumbnailButton} ${
                      currentIndex === index ? styles.activeThumbnail : ""
                    }`}
                    aria-label={`पेज ${page.pageNumber || index + 1} खोलें`}
                    aria-current={currentIndex === index ? "page" : undefined}
                  >
                    <Image
                      src={page.imageUrl}
                      alt=""
                      width={120}
                      height={160}
                      sizes="(max-width: 560px) 25vw, 120px"
                      loading="lazy"
                      className={styles.thumbnailImage}
                    />

                    <span>{page.pageNumber || index + 1}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}