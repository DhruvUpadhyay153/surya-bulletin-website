"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import styles from "./EpaperReader.module.css";

interface EpaperPageData {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface EpaperDocument {
  title: string;
  coverImageUrl: string;
  published: boolean;
}

export default function EpaperReaderPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [epaper, setEpaper] = useState<EpaperDocument | null>(null);
  const [pages, setPages] = useState<EpaperPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchEpaper() {
      try {
        setLoading(true);
        setError("");

        const epaperRef = doc(db, "epapers", id);
        const epaperSnapshot = await getDoc(epaperRef);

        if (!epaperSnapshot.exists()) {
          throw new Error("NOT_FOUND");
        }

        const data = epaperSnapshot.data();

        if (data.published !== true) {
          throw new Error("NOT_FOUND");
        }

        const epaperData: EpaperDocument = {
          title:
            typeof data.title === "string"
              ? data.title
              : "Surya Bulletin E-Paper",
          coverImageUrl:
            typeof data.coverImageUrl === "string"
              ? data.coverImageUrl
              : "",
          published: data.published === true,
        };

        const pagesRef = collection(db, "epapers", id, "pages");
        const pagesQuery = query(
          pagesRef,
          orderBy("pageNumber", "asc"),
        );
        const pagesSnapshot = await getDocs(pagesQuery);

        const pageItems: EpaperPageData[] = pagesSnapshot.docs
          .map((pageDocument) => {
            const pageData = pageDocument.data();

            return {
              id: pageDocument.id,
              imageUrl:
                typeof pageData.imageUrl === "string"
                  ? pageData.imageUrl
                  : "",
              pageNumber: Number(pageData.pageNumber ?? 0),
            };
          })
          .filter((page) => page.imageUrl)
          .sort((a, b) => a.pageNumber - b.pageNumber);

        if (active) {
          setEpaper(epaperData);
          setPages(pageItems);
          setCurrentPage(0);
        }
      } catch (err) {
        console.error("E-Paper reader error:", err);

        if (active) {
          if (
            err instanceof Error &&
            err.message === "NOT_FOUND"
          ) {
            setError("यह ई-पेपर उपलब्ध नहीं है।");
          } else {
            setError(
              "ई-पेपर लोड नहीं हो पाया। कृपया दोबारा कोशिश करें।",
            );
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchEpaper();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= pages.length) return;

      setCurrentPage(index);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [pages.length],
  );

  if (loading) {
    return (
      <main className={styles.readerPage}>
        <div className={styles.statusBox}>
          <span className={styles.loader} />
          <p>ई-पेपर खोला जा रहा है...</p>
        </div>
      </main>
    );
  }

  if (error || !epaper) {
    return (
      <main className={styles.readerPage}>
        <div className={styles.statusBox}>
          <h1>ई-पेपर उपलब्ध नहीं है</h1>
          <p>{error || "इस संस्करण को नहीं खोला जा सका।"}</p>

          <Link href="/e-paper" className={styles.backButton}>
            ← सभी ई-पेपर देखें
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.readerPage}>
      <div className={styles.readerContainer}>
        <Link href="/e-paper" className={styles.backLink}>
          ← सभी ई-पेपर
        </Link>

        <header className={styles.readerHeader}>
          <div>
            <span className={styles.eyebrow}>
              SURYA BULLETIN · DIGITAL EDITION
            </span>

            <h1>{epaper.title}</h1>

            <p>
              {pages.length > 0
                ? `कुल ${pages.length} पेज`
                : "पेज उपलब्ध नहीं हैं"}
            </p>
          </div>
        </header>

        {pages.length === 0 ? (
          <div className={styles.statusBox}>
            <h2>अभी पेज उपलब्ध नहीं हैं</h2>
            <p>
              इस ई-पेपर के लिए कोई पेज इमेज नहीं मिली।
            </p>
          </div>
        ) : (
          <>
            <section className={styles.viewer}>
              <div className={styles.viewerToolbar}>
                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ← पिछला
                </button>

                <span className={styles.pageCounter}>
                  पेज {pages[currentPage].pageNumber}
                  <span> / {pages.length}</span>
                </span>

                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pages.length - 1}
                >
                  अगला →
                </button>
              </div>

              <div className={styles.imageStage}>
                <Image
                  key={pages[currentPage].id}
                  src={pages[currentPage].imageUrl}
                  alt={`${epaper.title} — पेज ${pages[currentPage].pageNumber}`}
                  className={styles.newspaperImage}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>

              <div className={styles.bottomControls}>
                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ← पिछला पेज
                </button>

                <button
                  type="button"
                  className={styles.controlButton}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pages.length - 1}
                >
                  अगला पेज →
                </button>
              </div>
            </section>

            <section className={styles.pageNavigation}>
              <div className={styles.thumbnailHeading}>
                <h2>सभी पेज</h2>
                <span>{pages.length} पेज</span>
              </div>

              <div className={styles.thumbnailGrid}>
                {pages.map((page, index) => (
                  <button
                    type="button"
                    key={page.id}
                    onClick={() => goToPage(index)}
                    className={`${styles.thumbnailButton} ${
                      index === currentPage
                        ? styles.activeThumbnail
                        : ""
                    }`}
                    aria-label={`पेज ${page.pageNumber} खोलें`}
                    aria-current={
                      index === currentPage ? "page" : undefined
                    }
                  >
                    <Image
                      src={page.imageUrl}
                      alt=""
                      width={160}
                      height={220}
                      sizes="(max-width: 600px) 30vw, 160px"
                      loading="lazy"
                    />

                    <span>पेज {page.pageNumber}</span>
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