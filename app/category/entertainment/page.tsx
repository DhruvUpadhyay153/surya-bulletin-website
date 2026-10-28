import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "मनोरंजन की ताज़ा खबरें | Surya Bulletin",
  description:
    "फिल्मों, बॉलीवुड, टीवी, कलाकारों और मनोरंजन जगत की ताज़ा खबरें पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/entertainment",
  },
};

export default function EntertainmentPage() {
  return (
    <NewsListing
      title="मनोरंजन की खबरें"
      description="फिल्मों, कलाकारों और मनोरंजन जगत की प्रमुख खबरें और अपडेट्स।"
      filterMode="keyword"
      filterTerms={[
        "मनोरंजन",
        "बॉलीवुड",
        "फिल्म",
        "अभिनेता",
        "अभिनेत्री",
        "Entertainment",
        "Bollywood",
      ]}
    />
  );
}