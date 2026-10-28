import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "देश-दुनिया की ताज़ा खबरें | Surya Bulletin",
  description:
    "भारत और दुनिया की राजनीति, घटनाओं और प्रमुख खबरों की ताज़ा जानकारी पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/desh-duniya",
  },
};

export default function DeshDuniyaPage() {
  return (
    <NewsListing
      title="देश-दुनिया की खबरें"
      description="भारत और दुनिया की प्रमुख घटनाओं और ताज़ा खबरों की पूरी जानकारी।"
      filterMode="keyword"
      filterTerms={[
        "भारत",
        "देश",
        "दुनिया",
        "विदेश",
        "India",
        "World",
        "International",
      ]}
    />
  );
}