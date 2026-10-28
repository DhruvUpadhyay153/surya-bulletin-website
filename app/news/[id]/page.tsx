"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

/* =====================================================
   1. FIREBASE NEWS DATA KA STRUCTURE
   ===================================================== */

interface NewsArticle {
  title?: string;
  description?: string;
  imageUrl?: string;
  published?: boolean;
  status?: string;

  // Firestore Timestamp ya normal date string ho sakti hai.
  createdAt?: {
    toDate?: () => Date;
  } | string;

  tags?: string[];
  state?: string;
}

/* Related news ke liye document ID bhi chahiye. */
interface RelatedArticle extends NewsArticle {
  id: string;
}

/* =====================================================
   2. DATE AUR READING TIME HELPERS
   ===================================================== */

/* Firebase date ko Hindi format mein dikhata hai. */
function formatDate(value: NewsArticle["createdAt"]): string {
  if (!value) return "";

  let date: Date;

  if (typeof value === "object" && value !== null && value.toDate) {
    date = value.toDate();
  } else {
    date = new Date(value as string);
  }

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Reading time ka approximate estimate calculate karta hai. */
function getReadingTime(description: string): number {
  const words = description.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 180));
}

/* Timestamp ko sorting ke liye milliseconds mein convert karta hai. */
function getDateValue(value: NewsArticle["createdAt"]): number {
  if (!value) return 0;

  let date: Date;

  if (typeof value === "object" && value !== null && value.toDate) {
    date = value.toDate();
  } else {
    date = new Date(value as string);
  }

  const time = date.getTime();

  return Number.isNaN(time) ? 0 : time;
}

/* =====================================================
   3. NEWS DETAIL PAGE
   ===================================================== */

export default function NewsDetailPage() {
  // URL se current news ki document ID milti hai.
  const params = useParams<{ id: string }>();
  const newsId = params.id;

  // Current news aur loading/error states.
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  // Current news ke neeche dikhane ke liye related stories.
  const [relatedNews, setRelatedNews] = useState<RelatedArticle[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // Slider ko buttons se scroll karne ke liye reference.
  const sliderRef = useRef<HTMLDivElement>(null);

  /* =====================================================
     4. CURRENT NEWS AUR RELATED NEWS FIREBASE SE LOAD KARO
     ===================================================== */

  useEffect(() => {
    let active = true;

    async function fetchNews() {
      setLoading(true);
      setRelatedLoading(true);
      setError("");
      setShareMessage("");
      setArticle(null);
      setRelatedNews([]);

      try {
        // Pehle URL wali news ka exact Firestore document nikaalo.
        const articleRef = doc(db, "news", newsId);
        const snapshot = await getDoc(articleRef);

        if (!active) return;

        if (!snapshot.exists()) {
          setError("यह खबर नहीं मिली या इसे हटा दिया गया है।");
          return;
        }

        const currentArticle = snapshot.data() as NewsArticle;

        // Unpublished news ko public page par nahi dikhate.
        if (
          currentArticle.published !== true ||
          currentArticle.status !== "published"
        ) {
          setError("यह खबर अभी प्रकाशित नहीं है।");
          return;
        }

        setArticle(currentArticle);
      } catch (err) {
        console.error("[News Detail] Current news load failed:", err);

        if (active) {
          setError("खबर लोड नहीं हो सकी। कृपया दोबारा कोशिश करें।");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }

      // Current article ke alawa doosri published news fetch karte hain.
      try {
        const newsQuery = query(collection(db, "news"), limit(50));
        const newsSnapshot = await getDocs(newsQuery);

        if (!active) return;

        const stories: RelatedArticle[] = newsSnapshot.docs
          // Current news ko slider mein dobara nahi dikhana.
          .filter((newsDocument) => newsDocument.id !== newsId)

          // Har document ka data aur ID saath rakhna.
          .map((newsDocument) => ({
            id: newsDocument.id,
            ...(newsDocument.data() as NewsArticle),
          }))

          // Sirf published news ko related cards mein dikhana.
          .filter(
            (story) =>
              story.published === true &&
              story.status === "published",
          )

          // Nayi news ko pehle rakhna.
          .sort(
            (first, second) =>
              getDateValue(second.createdAt) -
              getDateValue(first.createdAt),
          )

          // Slider mein maximum 10 cards.
          .slice(0, 10);

        setRelatedNews(stories);
      } catch (err) {
        // Related news fail hone par main article phir bhi kaam karega.
        console.error("[News Detail] Related news load failed:", err);
      } finally {
        if (active) {
          setRelatedLoading(false);
        }
      }
    }

    if (newsId) {
      void fetchNews();
    }

    // Page change hone par purane request ke results ignore karte hain.
    return () => {
      active = false;
    };
  }, [newsId]);

  /* =====================================================
     5. NEWS SHARE KARNE KA FUNCTION
     ===================================================== */

  async function handleShare() {
    const shareUrl = window.location.href;

    try {
      // Supported browsers mein native share dialog khulega.
      if (navigator.share) {
        await navigator.share({
          title: article?.title || "Surya Bulletin",
          text: article?.title || "Surya Bulletin par padhein",
          url: shareUrl,
        });
      } else {
        // Baaki browsers mein article ka URL copy hoga.
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("खबर का लिंक कॉपी हो गया!");
      }
    } catch (err) {
      // Share dialog cancel karna normal behaviour hai.
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      console.error("[News Detail] Share failed:", err);
      setShareMessage("लिंक शेयर नहीं हो सका।");
    }
  }

  /* =====================================================
     6. RELATED NEWS SLIDER CONTROLS
     ===================================================== */

  // Arrow button se cards ko horizontal direction mein scroll karte hain.
  function scrollRelatedNews(direction: "left" | "right") {
    const slider = sliderRef.current;

    if (!slider) return;

    const distance = Math.max(250, slider.clientWidth * 0.8);

    slider.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  }

  /* =====================================================
     7. CURRENT NEWS KI CATEGORY
     ===================================================== */

  const category =
    article?.tags?.filter((tag) => typeof tag === "string").join(" / ") ||
    article?.state ||
    "ताज़ा खबर";

  /* =====================================================
     8. PAGE UI
     ===================================================== */

  return (
    <main className="article-page">
      {/* Website ka premium header. */}
      <header className="article-header">
        <div className="article-header-inner">
          <Link href="/" className="article-brand">
            <span className="article-brand-mark">S</span>

            <span className="article-brand-text">
              <strong>SURYA BULLETIN</strong>
              <small>सच जो दिल दहला दे</small>
            </span>
          </Link>

          <Link href="/" className="article-home-link">
            <span aria-hidden="true">←</span>
            <span>होम पेज</span>
          </Link>
        </div>
      </header>

      {/* Main article content. */}
      <div className="article-container">
        {/* Loading indicator. */}
        {loading && (
          <div className="article-status" role="status">
            <span className="article-loader" />
            <p>खबर लोड हो रही है...</p>
          </div>
        )}

        {/* Error state: news missing, unpublished ya load fail. */}
        {!loading && error && (
          <div className="article-status article-error" role="alert">
            <span className="article-error-mark">!</span>
            <h1>खबर उपलब्ध नहीं है</h1>
            <p>{error}</p>

            <Link href="/" className="article-back-button">
              होम पेज पर वापस जाएँ
            </Link>
          </div>
        )}

        {/* News successfully load hone par complete article render hota hai. */}
        {!loading && article && (
          <article className="premium-article">
            {/* Breadcrumb: user ko page ka location batata hai. */}
            <nav className="article-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">होम</Link>
              <span>/</span>
              <span>ताज़ा खबरें</span>
              <span>/</span>
              <span className="breadcrumb-current">पूरी खबर</span>
            </nav>

            {/* News category badge. */}
            <div className="article-category-row">
              <span className="article-category-badge">{category}</span>
              <span className="article-category-line" />
            </div>

            {/* Main headline. */}
            <h1 className="article-title">
              {article.title || "शीर्षक उपलब्ध नहीं"}
            </h1>

            {/* Short introduction, jo headline ke neeche dikhega. */}
            {article.description && (
              <p className="article-deck">
                {article.description.replace(/\s+/g, " ").trim().slice(0, 220)}
                {article.description.trim().length > 220 ? "..." : ""}
              </p>
            )}

            {/* Publication, date, reading time aur share button. */}
            <div className="article-byline">
              <div className="article-publication">
                <span className="article-publication-icon">S</span>

                <span>
                  <strong>Surya Bulletin</strong>
                  <small>डिजिटल न्यूज़ डेस्क</small>
                </span>
              </div>

              <div className="article-date">
                <span>{formatDate(article.createdAt)}</span>
                <span className="article-meta-dot">•</span>
                <span>
                  {getReadingTime(article.description || "")} मिनट पढ़ने का समय
                </span>
              </div>

              <button
                type="button"
                className="article-share-button"
                onClick={handleShare}
                aria-label="खबर शेयर करें"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
                </svg>

                <span>शेयर करें</span>
              </button>
            </div>

            {/* Share operation ka result. */}
            {shareMessage && (
              <p className="article-share-message" role="status">
                {shareMessage}
              </p>
            )}

            ```tsx
{/* Main hero image: full image visible in 16:9 ratio */}
{article.imageUrl && (
  <figure className="article-hero">
    <div
      className="article-hero-image"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        backgroundColor: "#f3f3f3",
      }}
    >
      <Image
        src={article.imageUrl}
        alt={article.title || "Surya Bulletin news"}
        fill
        unoptimized
        priority
        sizes="(max-width: 700px) 100vw, 1000px"
        style={{
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    </div>

    <figcaption>
      <span className="article-caption-mark" />
      Surya Bulletin | ताज़ा खबरें
    </figcaption>
  </figure>
)}

            {/* Full article description. Har paragraph alag render hota hai. */}
            <div className="article-body-layout">
              <aside className="article-side-label">
                <span>पूरी खबर</span>
                <span className="article-side-line" />
              </aside>

              <div className="article-body">
                {article.description ? (
                  article.description
                    .split(/\n+/)
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))
                ) : (
                  <p>इस खबर का विस्तृत विवरण उपलब्ध नहीं है।</p>
                )}

                {/* Article ke end par Surya Bulletin branding. */}
                <div className="article-end-note">
                  <span className="article-end-rule" />
                  <span>आप पढ़ रहे थे</span>
                  <strong>SURYA BULLETIN</strong>
                  <span className="article-end-tagline">
                    सच जो दिल दहला दे
                  </span>
                </div>

                {/* Article ke neeche home aur share actions. */}
                <div className="article-bottom-actions">
                  <Link href="/" className="article-back-button">
                    <span aria-hidden="true">←</span>
                    और खबरें पढ़ें
                  </Link>

                  <button
                    type="button"
                    className="article-share-bottom"
                    onClick={handleShare}
                  >
                    खबर शेयर करें ↗
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                9. RELATED NEWS SLIDER
                Current article ke neeche doosri published news.
                ================================================= */}

            <section
              className="related-news-section"
              aria-labelledby="related-news-title"
            >
              <div className="related-news-heading">
                <div className="related-news-heading-text">
                  <small>Surya Bulletin recommends</small>
                  <h2 id="related-news-title">और खबरें पढ़ें</h2>
                </div>

                {/* Desktop par arrows se cards scroll kar sakte hain. */}
                <div className="related-news-controls">
                  <button
                    type="button"
                    onClick={() => scrollRelatedNews("left")}
                    aria-label="पिछली खबरें"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollRelatedNews("right")}
                    aria-label="अगली खबरें"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Related news load hone tak loading message. */}
              {relatedLoading && (
                <p className="related-news-loading" role="status">
                  और खबरें लोड हो रही हैं...
                </p>
              )}

              {/* Firebase se related news na mile toh message. */}
              {!relatedLoading && relatedNews.length === 0 && (
                <p className="related-news-empty">
                  अभी और खबरें उपलब्ध नहीं हैं।
                </p>
              )}

              {/* Horizontal slider track. */}
              {!relatedLoading && relatedNews.length > 0 && (
                <div className="related-news-track" ref={sliderRef}>
                  {relatedNews.map((story) => {
                    const storyCategory =
                      story.tags
                        ?.filter((tag) => typeof tag === "string")
                        .join(" / ") ||
                      story.state ||
                      "ताज़ा खबर";

                    return (
                      <Link
                        key={story.id}
                        href={`/news/${story.id}`}
                        className="related-news-card"
                        aria-label={`${story.title || "खबर"} पूरी पढ़ें`}
                      >
                        {/* Card image, agar Firebase mein available hai. */}
                        <div className="related-news-image">
                          {story.imageUrl ? (
                            <Image
                              src={story.imageUrl}
                              alt={story.title || "Surya Bulletin news"}
                              fill
                              unoptimized
                              sizes="(max-width: 700px) 78vw, 350px"
                            />
                          ) : (
                            <div
                              aria-hidden="true"
                              style={{
                                display: "grid",
                                width: "100%",
                                height: "100%",
                                minHeight: 130,
                                placeItems: "center",
                                color: "#9e2a2b",
                                fontWeight: 700,
                              }}
                            >
                              SURYA BULLETIN
                            </div>
                          )}
                        </div>

                        <div className="related-news-card-content">
                          <span className="related-news-card-category">
                            {storyCategory}
                          </span>

                          <h3>{story.title || "शीर्षक उपलब्ध नहीं"}</h3>

                          <span className="related-news-card-date">
                            {formatDate(story.createdAt)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </article>
        )}
      </div>

      {/* Simple footer. */}
      <footer className="article-footer">
        <Link href="/">SURYA BULLETIN</Link>
        <span>विश्वसनीय खबरें, स्पष्ट दृष्टिकोण।</span>
      </footer>
    </main>
  );
}
