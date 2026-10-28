import type { Metadata } from "next";
import NewsListing from "../components/news/NewsListing";

export const metadata: Metadata = {
  title: "ताज़ा खबरें | Surya Bulletin",
  description:
    "देश, दुनिया, राजनीति, उत्तर प्रदेश और गाज़ियाबाद की ताज़ा खबरें पढ़ें। Surya Bulletin पर प्रकाशित खबरों के साथ अपडेट रहें।",
  alternates: {
    canonical: "https://suryabulletin.in/latest-news",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LatestNewsPage() {
  return (
    <NewsListing
      title="ताज़ा खबरें"
      description="देश और दुनिया की नई प्रकाशित खबरें, तारीख के अनुसार।"
    />
  );
}