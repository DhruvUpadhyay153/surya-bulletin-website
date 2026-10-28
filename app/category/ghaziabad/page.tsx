import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "गाज़ियाबाद की ताज़ा खबरें | Surya Bulletin",
  description:
    "गाज़ियाबाद की स्थानीय खबरें, प्रशासन, अपराध और शहर से जुड़े ताज़ा अपडेट्स पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/ghaziabad",
  },
};

export default function GhaziabadPage() {
  return (
    <NewsListing
      title="गाज़ियाबाद की खबरें"
      description="गाज़ियाबाद शहर और आसपास की प्रमुख घटनाओं की ताज़ा खबरें।"
      filterMode="keyword"
      filterTerms={["गाज़ियाबाद", "गाजियाबाद", "Ghaziabad"]}
    />
  );
}