"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const BREAKING_NEWS =
  "देश और दुनिया की हर बड़ी खबर, सबसे पहले — सिर्फ Surya Bulletin पर";

export default function SiteHeader() {
  const pathname = usePathname();

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
              className="editorial-logo"
            />

            <span className="editorial-brand-word">BULLETIN</span>
          </Link>

          {/* GOOGLE PLAY STORE IMAGE BUTTON */}
          <div className="editorial-app-area">
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
                sizes="150px"
                style={{
                  width: "150px",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </Link>
          </div>
        </div>

        {/* BRAND TAGLINE */}
        <div className="editorial-tagline-row">
          <span className="tagline-decoration" aria-hidden="true" />

          <p className="editorial-tagline">{SITE_CONFIG.tagline}</p>

          <span className="tagline-decoration" aria-hidden="true" />
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
              (item.href !== "/" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`editorial-category-card editorial-category-card--${item.icon} ${
  isActive ? "is-active" : ""
}`}
                aria-current={isActive ? "page" : undefined}
              >
               <span
  className={`editorial-category-icon ${
    item.icon === "epaper"
      ? "editorial-category-icon--epaper"
      : item.icon === "magazine"
        ? "editorial-category-icon--magazine"
        : ""
  }`}
>
  <CategoryIcon
    name={item.icon}
    size={item.icon === "epaper" || item.icon === "magazine" ? 34 : 30}
  />
</span>

                <span className="editorial-category-label">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ROW 3: BREAKING NEWS TICKER */}
      <div className="breaking-news-strip">
        <div className="breaking-news-inner">
          <span className="breaking-news-bolt" aria-hidden="true">
            ↯
          </span>

          <span className="breaking-news-label">
            ब्रेकिंग न्यूज़
          </span>

          {/* FIXED DIVIDER */}
          <span
            className="breaking-news-divider"
            aria-hidden="true"
          />

          {/* ANIMATED NEWS TEXT */}
          <div
            className="breaking-news-ticker"
            role="region"
            aria-label="ब्रेकिंग न्यूज़ अपडेट"
          >
            <div className="breaking-news-track">
              <span className="breaking-news-message">
                {BREAKING_NEWS}
              </span>

              <span
                className="breaking-news-message"
                aria-hidden="true"
              >
                {BREAKING_NEWS}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}