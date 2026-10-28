import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "धर्म और आध्यात्म की खबरें | Surya Bulletin",
  description:
    "धर्म, अध्यात्म, मंदिरों, धार्मिक आयोजनों और भारतीय संस्कृति से जुड़ी खबरें पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/dharma",
  },
};

export default function DharmaPage() {
  return (
    <NewsListing
      title="धर्म और अध्यात्म"
      description="धर्म, अध्यात्म, मंदिरों और धार्मिक आयोजनों से जुड़ी प्रमुख खबरें।"
      filterMode="keyword"
      filterTerms={[
        "धर्म",
        "अध्यात्म",
        "मंदिर",
        "पूजा",
        "सनातन",
        "Dharma",
        "Religion",
        "Spiritual",
      ]}
    />
  );
}