/**
 * NewsCard — Surya Bulletin
 *
 * 1. News image, category, date, headline aur one-line summary.
 * 2. Image, headline aur read-more link se individual news page open hota hai.
 */

import Image from "next/image";
import Link from "next/link";

import type { News } from "../../types/news";

interface NewsCardProps {
  story: News;
  index: number;
}

export default function NewsCard({ story, index }: NewsCardProps) {
  const isDemoStory = story.publishedAt === "Demo story";

  const displayDate = isDemoStory
    ? "डेमो खबर"
    : story.publishedAt;

  const newsUrl = `/news/${encodeURIComponent(story.id)}`;

  return (
    <article className="story-card">
      {/* Image par click karne se poori news khulegi. */}
      <Link
        href={newsUrl}
        className="story-image"
        aria-label={`${story.title} — पूरी खबर पढ़ें`}
      >
        <Image
          src={story.image}
          alt={story.title}
          fill
          unoptimized
          sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
        />

        <span className="image-index">
          {String(index + 1).padStart(2, "0")}
        </span>

        {isDemoStory && (
          <span className="story-image-label">
            डेमो स्टोरी
          </span>
        )}
      </Link>

      <div className="story-content">
        {/* Category aur date */}
        <div className="story-meta">
          <span>{story.category}</span>
          <span>{displayDate}</span>
        </div>

        {/* Headline: maximum 2 lines */}
        <h3
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          <Link
            href={newsUrl}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {story.title}
          </Link>
        </h3>

        {/* Description: sirf 1 line */}
        <p
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
          }}
        >
          {story.excerpt}
        </p>

        {/* Individual news page ka link */}
        <Link className="read-link" href={newsUrl}>
          पूरी खबर पढ़ें
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}