"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

type HomepageStory = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  timestamp: number;
};

type CategoryDesign = {
  href: string;
  theme: string;
  icon: "india" | "world" | "politics" | "crime" | "city" | "up" | "entertainment" | "dharma";
};

const CATEGORY_DESIGNS: Record<string, CategoryDesign> = {
  भारत: {
    href: "/category/desh-duniya",
    theme: "india",
    icon: "india",
  },
  दुनिया: {
    href: "/category/desh-duniya",
    theme: "world",
    icon: "world",
  },
  राजनीति: {
    href: "/category/rajniti",
    theme: "politics",
    icon: "politics",
  },
  क्राइम: {
    href: "/category/crime",
    theme: "crime",
    icon: "crime",
  },
  गाज़ियाबाद: {
    href: "/category/ghaziabad",
    theme: "city",
    icon: "city",
  },
  "उत्तर प्रदेश": {
    href: "/category/uttar-pradesh",
    theme: "up",
    icon: "up",
  },
  मनोरंजन: {
    href: "/category/entertainment",
    theme: "entertainment",
    icon: "entertainment",
  },
  धर्म: {
    href: "/category/dharma",
    theme: "dharma",
    icon: "dharma",
  },
};

const CATEGORY_LIST = [
  "भारत",
  "दुनिया",
  "राजनीति",
  "क्राइम",
  "गाज़ियाबाद",
  "उत्तर प्रदेश",
  "मनोरंजन",
  "धर्म",
];

function formatDate(value: unknown): {
  label: string;
  timestamp: number;
} {
  let date: Date | null = null;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    date = (value as { toDate: () => Date }).toDate();
  } else if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    date = new Date(value);
  }

  if (!date || Number.isNaN(date.getTime())) {
    return {
      label: "ताज़ा अपडेट",
      timestamp: 0,
    };
  }

  return {
    label: date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    timestamp: date.getTime(),
  };
}

function getCategory(data: Record<string, unknown>): string {
  if (Array.isArray(data.tags)) {
    const tag = data.tags.find(
      (item): item is string =>
        typeof item === "string" &&
        !["latest", "breaking", "for you"].includes(
          item.toLowerCase(),
        ),
    );

    if (tag) return tag;
  }

  if (
    typeof data.state === "string" &&
    data.state.trim() &&
    data.state.toLowerCase() !== "all"
  ) {
    return data.state;
  }

  return "न्यूज़";
}

/* Colourful SVG icons for category shortcuts */
function CategoryIcon({
  type,
}: {
  type: CategoryDesign["icon"];
}) {
  switch (type) {
    case "india":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#FFF1D8" />
          <path
            d="M13 25L32 12L51 25"
            stroke="#E87528"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 27H46V46H18V27Z"
            fill="#FFFFFF"
            stroke="#E87528"
            strokeWidth="2.5"
          />
          <path
            d="M14 48H50"
            stroke="#16864A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M25 27V45M32 27V45M39 27V45"
            stroke="#16864A"
            strokeWidth="2.5"
          />
          <circle cx="32" cy="19" r="3" fill="#2466BD" />
        </svg>
      );

    case "world":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#E1F3FF" />
          <circle
            cx="32"
            cy="32"
            r="20"
            fill="#3E9AE8"
            stroke="#176CC0"
            strokeWidth="2"
          />
          <path
            d="M18 22L25 18L29 23L25 29L19 30L17 37L24 43L29 40L31 32L38 29L43 33L47 27L42 19"
            fill="#63C58A"
          />
          <path
            d="M32 12C25 19 25 45 32 52M32 12C39 19 39 45 32 52M13 32H51"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            opacity=".85"
          />
        </svg>
      );

    case "politics":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#F0E8FF" />
          <path
            d="M15 23L32 13L49 23H15Z"
            fill="#9060D8"
          />
          <path
            d="M13 25H51V30H13Z"
            fill="#6D42BA"
          />
          <path
            d="M17 32V45M27 32V45M37 32V45M47 32V45"
            stroke="#9060D8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M12 48H52"
            stroke="#6D42BA"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M22 19H42"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        </svg>
      );

    case "crime":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#FFE5E8" />
          <path
            d="M32 12L48 18V31C48 41 41 48 32 52C23 48 16 41 16 31V18L32 12Z"
            fill="#F05A68"
          />
          <path
            d="M32 20V35"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="42" r="2.8" fill="#FFFFFF" />
        </svg>
      );

    case "city":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#DDF8F0" />
          <path
            d="M13 48V29L25 20V48H13Z"
            fill="#38B99A"
          />
          <path
            d="M25 48V13H42V48H25Z"
            fill="#168F83"
          />
          <path
            d="M42 48V27L52 32V48H42Z"
            fill="#56CBA8"
          />
          <path
            d="M30 19H35M30 26H35M30 33H35M30 40H35M18 34H21M18 40H21M46 36H49M46 42H49"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M10 49H54"
            stroke="#168F83"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "up":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#FFF0D9" />
          <path
            d="M19 15L29 15L29 22L36 22L36 28L45 28L45 37L39 37L39 46L29 46L29 40L20 40L20 31L14 31L14 23L19 23Z"
            fill="#F29A38"
          />
          <path
            d="M25 23H30M33 29H39M25 35H31M32 41H36"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="45" cy="17" r="5" fill="#EA6D44" />
        </svg>
      );

    case "entertainment":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#FFE7F3" />
          <rect
            x="13"
            y="20"
            width="38"
            height="27"
            rx="6"
            fill="#E65CA5"
          />
          <path
            d="M27 27L39 33.5L27 40V27Z"
            fill="#FFFFFF"
          />
          <path
            d="M20 15L25 20M44 15L39 20"
            stroke="#B8327A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="47" cy="16" r="3" fill="#F6B84A" />
          <circle cx="17" cy="14" r="2.5" fill="#8B67E8" />
        </svg>
      );

    case "dharma":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
          <circle cx="32" cy="32" r="29" fill="#FFF0D7" />
          <path
            d="M32 12C36 19 44 21 44 29C44 37 38 42 32 42C26 42 20 37 20 29C20 21 28 19 32 12Z"
            fill="#F18A28"
          />
          <path
            d="M32 25C35 30 36 34 32 38C28 34 29 30 32 25Z"
            fill="#FFD75A"
          />
          <path
            d="M18 45C22 41 26 40 32 40C38 40 42 41 46 45"
            stroke="#D86B20"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M23 49H41"
            stroke="#D86B20"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return null;
  }
}

function CategoryShortcuts() {
  return (
    <section
      className="category-shortcuts-section"
      aria-labelledby="category-shortcuts-heading"
    >
      <div className="category-shortcuts-heading">
        <div>
          <span className="category-shortcuts-eyebrow">
            अपनी पसंद की खबरें
          </span>

          <h2 id="category-shortcuts-heading">
            खबरें पढ़ें
          </h2>
        </div>

        <span className="category-shortcuts-caption">
          अपनी पसंद की श्रेणी चुनें
        </span>
      </div>

      <div className="category-shortcuts-grid">
        {CATEGORY_LIST.map((category) => {
          const design = CATEGORY_DESIGNS[category];

          return (
            <Link
              key={category}
              href={design.href}
              className={`category-shortcut-card category-theme-${design.theme}`}
              aria-label={`${category} की खबरें पढ़ें`}
            >
              <span className="category-shortcut-icon">
                <CategoryIcon type={design.icon} />
              </span>

              <span className="category-shortcut-name">
                {category}
              </span>

              <span
                className="category-shortcut-arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function HomepageNews() {
  const [stories, setStories] = useState<HomepageStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Firebase se published news realtime load karein.
  useEffect(() => {
    const newsQuery = query(
      collection(db, "news"),
      limit(50),
    );

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        const publishedStories: HomepageStory[] = [];

        snapshot.docs.forEach((document) => {
          const data = document.data();

          if (
            data.published !== true ||
            data.status !== "published"
          ) {
            return;
          }

          if (
            typeof data.title !== "string" ||
            !data.title.trim()
          ) {
            return;
          }

          const publishedDate = formatDate(data.createdAt);

          publishedStories.push({
            id: document.id,
            title: data.title,
            description:
              typeof data.description === "string"
                ? data.description
                : "",
            imageUrl:
              typeof data.imageUrl === "string"
                ? data.imageUrl.trim()
                : "",
            category: getCategory(data),
            date: publishedDate.label,
            timestamp: publishedDate.timestamp,
          });
        });

        publishedStories.sort(
          (a, b) => b.timestamp - a.timestamp,
        );

        setStories(publishedStories);
        setActiveSlide(0);
        setLoading(false);
        setError(false);
      },
      (firebaseError) => {
        console.error(
          "[Surya Bulletin] Homepage news error:",
          firebaseError.code,
          firebaseError.message,
        );

        setError(true);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Hero carousel mein maximum 6 news.
  const carouselStories = stories.slice(0, 6);
  const activeStory = carouselStories[activeSlide];

  // Active slide ko available news ke andar rakhein.
  useEffect(() => {
    if (activeSlide >= carouselStories.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, carouselStories.length]);

  // Automatic carousel: har 1.5 seconds mein next slide.
  useEffect(() => {
    if (isPaused || carouselStories.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide(
        (current) => (current + 1) % carouselStories.length,
      );
    }, 1500);

    return () => window.clearInterval(timer);
  }, [isPaused, carouselStories.length]);

  const goToPrevious = () => {
    if (carouselStories.length <= 1) return;

    setActiveSlide((current) =>
      current === 0
        ? carouselStories.length - 1
        : current - 1,
    );
  };

  const goToNext = () => {
    if (carouselStories.length <= 1) return;

    setActiveSlide(
      (current) => (current + 1) % carouselStories.length,
    );
  };

  const sideStories = stories.slice(1, 5);

  // Hero aur side news ke baad wali news.
  const remainingStories = stories.slice(6);

  // Pehle 3 additional news cards.
  const firstThreeStories = remainingStories.slice(0, 3);

  // Category shortcuts ke baad ki baaki news.
  const laterStories = remainingStories.slice(3);

  return (
    <section className="wrap editorial-home-news">
      <div className="editorial-section-heading">
        <div>
          <span className="section-kicker">
            देश, दुनिया और आपके शहर से
          </span>

          <h1>आज की प्रमुख खबरें</h1>
        </div>

        <p>
          अहम खबरें, विश्वसनीय जानकारी और ताज़ा अपडेट्स।
        </p>
      </div>

      {loading && (
        <p className="editorial-state" role="status">
          ताज़ा खबरें लोड हो रही हैं...
        </p>
      )}

      {!loading && error && (
        <p className="editorial-state" role="alert">
          खबरें अभी लोड नहीं हो सकीं। कृपया कुछ देर बाद दोबारा
          कोशिश करें।
        </p>
      )}

      {!loading && !error && stories.length === 0 && (
        <p className="editorial-state">
          अभी कोई प्रकाशित खबर उपलब्ध नहीं है।
        </p>
      )}

      {!loading && !error && activeStory && (
        <>
          {/* HERO NEWS AND RIGHT-SIDE LATEST NEWS */}
          <div className="editorial-lead-layout">
            <article
              className="editorial-lead-story editorial-carousel"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  setIsPaused(false);
                }
              }}
              aria-roledescription="carousel"
              aria-label="प्रमुख खबरों का स्लाइडर"
            >
              {/* IMAGE SLIDER */}
              <div className="editorial-carousel-visual">
                <div className="editorial-carousel-viewport">
                  <div
                    className="editorial-carousel-track"
                    style={{
                      transform: `translate3d(-${activeSlide * 100}%, 0, 0)`,
                    }}
                  >
                    {carouselStories.map((story, index) => (
                      <div
                        className="editorial-carousel-slide"
                        key={story.id}
                        aria-hidden={index !== activeSlide}
                      >
                        <Link
                          href={`/news/${encodeURIComponent(story.id)}`}
                          className={`editorial-lead-image ${
                            story.imageUrl ? "" : "no-image"
                          }`}
                          tabIndex={index === activeSlide ? 0 : -1}
                          aria-label={story.title}
                        >
                          {story.imageUrl ? (
                            <Image
                              src={story.imageUrl}
                              alt={story.title}
                              fill
                              priority={index === 0}
                              loading={index === 0 ? "eager" : "lazy"}
                              sizes="(max-width: 760px) 100vw, 62vw"
                            />
                          ) : (
                            <span className="editorial-image-fallback">
                              SURYA BULLETIN
                            </span>
                          )}

                          <span className="editorial-image-badge">
                            प्रमुख खबर
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM-CENTER SLIDER DOTS */}
                {carouselStories.length > 1 && (
                  <div
                    className="editorial-carousel-dots"
                    aria-label="प्रमुख खबर चुनें"
                  >
                    {carouselStories.map((story, index) => (
                      <button
                        key={story.id}
                        type="button"
                        className={
                          index === activeSlide ? "is-active" : ""
                        }
                        onClick={() => setActiveSlide(index)}
                        aria-label={`खबर ${index + 1}: ${story.title}`}
                        aria-current={
                          index === activeSlide ? "true" : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ACTIVE STORY DETAILS */}
              <div className="editorial-lead-copy">
                <div className="editorial-story-meta">
                  <span>{activeStory.category}</span>
                  <time>{activeStory.date}</time>
                </div>

                <h2>
                  <Link
                    href={`/news/${encodeURIComponent(activeStory.id)}`}
                  >
                    {activeStory.title}
                  </Link>
                </h2>

                {activeStory.description && (
                  <p>{activeStory.description}</p>
                )}

                <div className="editorial-carousel-footer">
                  <Link
                    className="editorial-read-link"
                    href={`/news/${encodeURIComponent(activeStory.id)}`}
                  >
                    पूरी खबर पढ़ें{" "}
                    <span aria-hidden="true">↗</span>
                  </Link>

                  {carouselStories.length > 1 && (
                    <div className="editorial-carousel-controls">
                      <button
                        type="button"
                        onClick={goToPrevious}
                        aria-label="पिछली खबर"
                        title="पिछली खबर"
                      >
                        &#8592;
                      </button>

                      <button
                        type="button"
                        onClick={goToNext}
                        aria-label="अगली खबर"
                        title="अगली खबर"
                      >
                        &#8594;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* RIGHT-SIDE LATEST STORIES */}
            <aside className="editorial-side-news">
              <div className="editorial-side-heading">
                <h2>अन्य प्रमुख खबरें</h2>
                <Link href="/latest-news">सभी देखें</Link>
              </div>

              {sideStories.length > 0 ? (
                sideStories.map((story) => (
                  <article
                    className="editorial-side-story"
                    key={story.id}
                  >
                    <Link
                      href={`/news/${encodeURIComponent(story.id)}`}
                      className={`editorial-side-image ${
                        story.imageUrl ? "" : "no-image"
                      }`}
                      aria-label={story.title}
                    >
                      {story.imageUrl ? (
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          sizes="140px"
                        />
                      ) : (
                        <span>SB</span>
                      )}
                    </Link>

                    <div className="editorial-side-copy">
                      <span>{story.category}</span>

                      <h3>
                        <Link
                          href={`/news/${encodeURIComponent(story.id)}`}
                        >
                          {story.title}
                        </Link>
                      </h3>

                      <time>{story.date}</time>
                    </div>
                  </article>
                ))
              ) : (
                <p className="editorial-muted">
                  दूसरी प्रमुख खबरें प्रकाशित होने पर यहाँ दिखाई देंगी।
                </p>
              )}
            </aside>
          </div>

          {/* MORE NEWS: FIRST THREE CARDS */}
          {firstThreeStories.length > 0 && (
            <section
              className="editorial-more-news"
              aria-labelledby="editorial-more-heading"
            >
              <div className="editorial-section-heading compact">
                <div>
                  <span className="section-kicker">
                    ताज़ा अपडेट्स
                  </span>

                  <h2 id="editorial-more-heading">
                    और बड़ी खबरें
                  </h2>
                </div>

                <span className="editorial-count">
                  {remainingStories.length} खबरें
                </span>
              </div>

              <div className="editorial-news-grid">
                {firstThreeStories.map((story) => (
                  <article
                    className="editorial-news-card"
                    key={story.id}
                  >
                    <Link
                      href={`/news/${encodeURIComponent(story.id)}`}
                      className={`editorial-card-image ${
                        story.imageUrl ? "" : "no-image"
                      }`}
                      aria-label={story.title}
                    >
                      {story.imageUrl ? (
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          sizes="(max-width: 760px) 100vw, 33vw"
                        />
                      ) : (
                        <span>Surya Bulletin</span>
                      )}
                    </Link>

                    <div className="editorial-card-copy">
                      <div className="editorial-story-meta">
                        <span>{story.category}</span>
                        <time>{story.date}</time>
                      </div>

                      <h3>
                        <Link
                          href={`/news/${encodeURIComponent(story.id)}`}
                        >
                          {story.title}
                        </Link>
                      </h3>

                      {story.description && (
                        <p>{story.description}</p>
                      )}

                      <Link
                        className="editorial-read-link"
                        href={`/news/${encodeURIComponent(story.id)}`}
                      >
                        पूरी खबर पढ़ें{" "}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* COLOURFUL CATEGORY SHORTCUTS: AFTER FIRST THREE CARDS */}
          {firstThreeStories.length === 3 && <CategoryShortcuts />}

          {/* REMAINING NEWS: BELOW CATEGORY SHORTCUTS */}
          {laterStories.length > 0 && (
            <section
              className="editorial-more-news editorial-later-news"
              aria-labelledby="editorial-later-heading"
            >
              <div className="editorial-section-heading compact">
                <div>
                  <span className="section-kicker">
                    और भी खबरें
                  </span>

                  <h2 id="editorial-later-heading">
                    बाकी बड़ी खबरें
                  </h2>
                </div>

                <span className="editorial-count">
                  {laterStories.length} खबरें
                </span>
              </div>

              <div className="editorial-news-grid">
                {laterStories.map((story) => (
                  <article
                    className="editorial-news-card"
                    key={story.id}
                  >
                    <Link
                      href={`/news/${encodeURIComponent(story.id)}`}
                      className={`editorial-card-image ${
                        story.imageUrl ? "" : "no-image"
                      }`}
                      aria-label={story.title}
                    >
                      {story.imageUrl ? (
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          sizes="(max-width: 760px) 100vw, 33vw"
                        />
                      ) : (
                        <span>Surya Bulletin</span>
                      )}
                    </Link>

                    <div className="editorial-card-copy">
                      <div className="editorial-story-meta">
                        <span>{story.category}</span>
                        <time>{story.date}</time>
                      </div>

                      <h3>
                        <Link
                          href={`/news/${encodeURIComponent(story.id)}`}
                        >
                          {story.title}
                        </Link>
                      </h3>

                      {story.description && (
                        <p>{story.description}</p>
                      )}

                      <Link
                        className="editorial-read-link"
                        href={`/news/${encodeURIComponent(story.id)}`}
                      >
                        पूरी खबर पढ़ें{" "}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </section>
  );
}