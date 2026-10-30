
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { SITE_CONFIG } from "../../constants/site";
import CategoryIcon, {
  type CategoryIconName,
} from "../CategoryIcon";

const NAV_LINKS: {
  label: string;
  href: string;
  icon: CategoryIconName;
}[] = [
  { label: "होम", href: "/", icon: "home" },
  { label: "ई-पेपर", href: "/e-paper", icon: "epaper" },
  { label: "मैगज़ीन", href: "/magazines", icon: "magazine" },
  { label: "ताज़ा खबरें", href: "/latest-news", icon: "latest" },
  { label: "देश-दुनिया", href: "/category/desh-duniya", icon: "world" },
  { label: "राजनीति", href: "/category/rajniti", icon: "politics" },
  {
    label: "उत्तर प्रदेश",
    href: "/category/uttar-pradesh",
    icon: "uttar-pradesh",
  },
  {
    label: "गाज़ियाबाद",
    href: "/category/ghaziabad",
    icon: "location",
  },
  { label: "क्राइम", href: "/category/crime", icon: "crime" },
  {
    label: "मनोरंजन",
    href: "/category/entertainment",
    icon: "entertainment",
  },
  { label: "धर्म", href: "/category/dharma", icon: "dharma" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  const [breakingNewsMessage, setBreakingNewsMessage] = useState("");
  const [breakingNewsEnabled, setBreakingNewsEnabled] = useState(false);

  useEffect(() => {
    const breakingNewsRef = doc(db, "website_settings", "breaking_news");

    const unsubscribe = onSnapshot(
      breakingNewsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          console.warn("[Breaking News] Document not found.");
          setBreakingNewsMessage("");
          setBreakingNewsEnabled(false);
          return;
        }

        const data = snapshot.data();

        console.log("[Breaking News] Firestore fields:", Object.keys(data));
        console.log("[Breaking News] Full data:", data);

        const message =
          typeof data.message === "string" ? data.message.trim() : "";

        // Read enabled only if the field is present and boolean.
        const enabled =
          typeof data.enabled === "boolean"
            ? data.enabled
            : false;

        console.log("[Breaking News] Message:", message);
        console.log("[Breaking News] Enabled:", enabled);
        console.log(
          "[Breaking News] Final visibility:",
          enabled && message.length > 0
        );

        setBreakingNewsMessage(message);
        setBreakingNewsEnabled(enabled && message.length > 0);
      },
      (error) => {
        console.error("[Breaking News] Firestore error:", error);
        setBreakingNewsMessage("");
        setBreakingNewsEnabled(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <header className="site-header editorial-header">
      {/* ROW 1: BRAND MASTHEAD */}
      <div className="editorial-masthead">
        <div className="editorial-masthead-inner">
          <div className="masthead-spacer" aria-hidden="true" />

          <Link
            href="/"
            className="editorial-brand"
            aria-label="Surya Bulletin — होम"
          >
            <span className="editorial-brand-word">SURYA</span>

            <Image
              src="/images/logo.png"
              alt="Surya Bulletin का लोगो"
              width={160}
              height={150}
              priority
              sizes="(max-width: 480px) 76px, (max-width: 768px) 100px, 160px"
              className="editorial-logo"
            />

            <span className="editorial-brand-word">BULLETIN</span>
          </Link>

          {/* DESKTOP GOOGLE PLAY BUTTON */}
          <div className="editorial-app-area editorial-app-area--desktop">
            <Link
              className="editorial-app-button"
              href={SITE_CONFIG.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Surya Bulletin ऐप डाउनलोड करें"
              title="ऐप डाउनलोड करें"
            >
              <Image
                src="/images/playstoreicon.webp"
                alt="Get it on Google Play"
                width={150}
                height={45}
                priority
                sizes="(max-width: 480px) 100px, (max-width: 768px) 120px, 150px"
                style={{
                  width: "100%",
                  maxWidth: "150px",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </Link>
          </div>
        </div>

        {/* TAGLINE */}
        <div className="editorial-tagline-row">
          <span className="tagline-decoration" aria-hidden="true" />

          <p className="editorial-tagline">{SITE_CONFIG.tagline}</p>

          <span className="tagline-decoration" aria-hidden="true" />
        </div>

        {/* MOBILE GOOGLE PLAY BUTTON */}
        <div className="editorial-app-area editorial-app-area--mobile">
          <Link
            className="editorial-app-button"
            href={SITE_CONFIG.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Surya Bulletin ऐप डाउनलोड करें"
            title="ऐप डाउनलोड करें"
          >
            <Image
              src="/images/playstoreicon.webp"
              alt="Get it on Google Play"
              width={150}
              height={45}
              priority
              sizes="(max-width: 480px) 100px, (max-width: 768px) 120px, 150px"
              style={{
                width: "100%",
                maxWidth: "150px",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>
      </div>

      {/* ROW 2: CATEGORY NAVIGATION */}
      <div className="editorial-navigation">
        <nav
          className="editorial-category-nav"
          aria-label="मुख्य श्रेणियाँ"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

         

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`editorial-category-card editorial-category-card--${item.icon}${
                  isActive ? " is-active" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`editorial-category-icon${
                    item.icon === "epaper"
                      ? " editorial-category-icon--epaper"
                      : item.icon === "magazine"
                        ? " editorial-category-icon--magazine"
                        : ""
                  }`}
                  aria-hidden="true"
                >
                  <CategoryIcon name={item.icon} size={30} />
                </span>

                <span className="editorial-category-label">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ROW 3: FIRESTORE BREAKING NEWS TICKER */}
      {breakingNewsEnabled && (
        <div className="breaking-news-strip">
          <div className="breaking-news-inner">
            <span className="breaking-news-bolt" aria-hidden="true">
              ↯
            </span>

            <span className="breaking-news-label">ब्रेकिंग न्यूज़</span>

            <span
              className="breaking-news-divider"
              aria-hidden="true"
            />

            <div
              className="breaking-news-ticker"
              role="region"
              aria-label="ब्रेकिंग न्यूज़ अपडेट"
            >
              <div className="breaking-news-track">
                <span className="breaking-news-message">
                  {breakingNewsMessage}
                </span>

                <span
                  className="breaking-news-message"
                  aria-hidden="true"
                >
                  {breakingNewsMessage}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
