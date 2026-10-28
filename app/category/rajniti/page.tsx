import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "राजनीति की ताज़ा खबरें | Surya Bulletin",
  description:
    "भारत की राजनीति, राजनीतिक दलों, नेताओं और सरकारी फैसलों से जुड़ी ताज़ा खबरें पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/rajniti",
  },
};

export default function RajnitiPage() {
  return (
    <NewsListing
      title="राजनीति की खबरें"
      description="राजनीतिक घटनाक्रम, नेताओं के बयान और सरकारी फैसलों की ताज़ा जानकारी।"
      filterMode="keyword"
      filterTerms={[
        "राजनीति",
        "राजनीतिक",
        "चुनाव",
        "सरकार",
        "नेता",
        "Politics",
        "Election",
      ]}
    />
  );
}