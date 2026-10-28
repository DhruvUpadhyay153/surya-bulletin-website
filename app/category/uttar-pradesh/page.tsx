import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "उत्तर प्रदेश की ताज़ा खबरें | Surya Bulletin",
  description:
    "उत्तर प्रदेश की राजनीति, प्रशासन, अपराध और अन्य प्रमुख घटनाओं की ताज़ा खबरें पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/uttar-pradesh",
  },
};

export default function UttarPradeshPage() {
  return (
    <NewsListing
      title="उत्तर प्रदेश की खबरें"
      description="उत्तर प्रदेश की प्रमुख घटनाओं और ताज़ा अपडेट्स की पूरी जानकारी।"
      filterMode="keyword"
      filterTerms={["उत्तर प्रदेश", "Uttar Pradesh", "UP"]}
    />
  );
}