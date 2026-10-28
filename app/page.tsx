/**
 * Surya Bulletin Homepage
 *
 * Existing header/footer reuse hote hain.
 * Homepage news Firestore se aati hai.
 * Trending topics, About aur app download sections retained hain.
 */

import Link from "next/link";
import Image from "next/image";

import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import HomepageNews from "./components/news/HomepageNews";

import { SITE_CONFIG } from "./constants/site";

export default function Home() {
  return (
    <main className="news-home">
      <SiteHeader />

      {/* Firestore news carousel aur news cards */}
      <HomepageNews />

      {/* Category shortcuts filhaal homepage par nahi dikhaye ja rahe */}

      {/* Trending topics */}
      <section id="trending" className="trending-section">
        <div className="wrap">
          <div className="section-heading trending-premium-heading">
            <div>
              <span className="section-kicker trending-premium-kicker">
                पाठकों की रुचि
              </span>

              <h2>
                ट्रेंडिंग विषय <span className="red-period">.</span>
              </h2>
            </div>

            <span className="section-side-note trending-premium-note">
              <span className="trending-live-dot" />
              आज चर्चा में
            </span>
          </div>

          <div className="trending-grid trending-premium-grid">
            {[
              {
                title: "देश की बड़ी खबरें",
                route: "/category/desh-duniya",
                number: "01",
                icon: "india",
                color: "saffron",
              },
              {
                title: "राजनीति",
                route: "/category/rajniti",
                number: "02",
                icon: "politics",
                color: "gold",
              },
              {
                title: "लोकल न्यूज़",
                route: "/category/ghaziabad",
                number: "03",
                icon: "location",
                color: "green",
              },
              {
                title: "मनोरंजन",
                route: "/category/entertainment",
                number: "04",
                icon: "entertainment",
                color: "purple",
              },
            ].map((topic) => (
              <Link
                href={topic.route}
                className={`trending-item trending-premium-card trending-${topic.color}`}
                key={topic.title}
              >
                <span className="trending-premium-icon" aria-hidden="true">
                  {topic.icon === "india" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 21V10L12 4L20 10V21" />
                      <path d="M2.5 21H21.5M8 21V15H16V21" />
                      <path d="M8 10H8.1M12 10H12.1M16 10H16.1" />
                      <path d="M10 4V2.5H14V4" />
                    </svg>
                  )}

                  {topic.icon === "politics" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M3 9L12 4L21 9H3Z" />
                      <path d="M5 11V18M9 11V18M15 11V18M19 11V18" />
                      <path d="M3 20H21M2 22H22" />
                      <path d="M12 2V4" />
                    </svg>
                  )}

                  {topic.icon === "location" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M20 10C20 15 12 22 12 22S4 15 4 10A8 8 0 1 1 20 10Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  )}

                  {topic.icon === "entertainment" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M3 9H21M7 2L10 5M14 2L17 5" />
                      <path d="M10 12L15 15L10 18V12Z" />
                    </svg>
                  )}
                </span>

                <span className="trending-premium-content">
                  <span className="trending-number">{topic.number}</span>

                  <span className="trending-premium-title">
                    {topic.title}
                  </span>
                </span>

                <span className="trending-premium-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Surya Bulletin */}
      <section id="about" className="wrap about-section">
        <div className="about-mark" aria-hidden="true">
          SB
        </div>

        <div className="about-copy">
          <span className="section-kicker">हम हैं Surya Bulletin</span>

          <h2>
            खबरें साफ़, <em>नज़र साफ़।</em>
          </h2>

          <p>
            हमारा उद्देश्य पाठकों तक अहम खबरें और उपयोगी जानकारी
            सरल भाषा में पहुँचाना है।
          </p>
        </div>

        {/* Play Store icon - About section */}
        <Link
          className="about-link"
          href={SITE_CONFIG.appUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Surya Bulletin ऐप Play Store से डाउनलोड करें"
        >
          <Image
            src="/images/playstoreicon.webp"
            alt="Get it on Google Play"
            width={160}
            height={48}
            className="playstore-download-icon"
          />
        </Link>
      </section>

      {/* Android app download */}
      <section className="app-promo">
        <div className="wrap app-promo-inner">
          <div>
            <span className="promo-kicker">खबरों से जुड़े रहें</span>

            <h2>Surya Bulletin आपके साथ।</h2>

            <p>
              ऐप डाउनलोड करें और खबरें पढ़ने के लिए हमारे साथ जुड़ें।
            </p>
          </div>

          {/* Play Store icon - App promo section */}
          <Link
            className="promo-button"
            href={SITE_CONFIG.appUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Surya Bulletin ऐप Play Store से डाउनलोड करें"
          >
            <Image
              src="/images/playstoreicon.webp"
              alt="Get it on Google Play"
              width={180}
              height={180}
              className="playstore-download-icon"
            />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}