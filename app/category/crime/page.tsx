import type { Metadata } from "next";
import NewsListing from "../../components/news/NewsListing";

export const metadata: Metadata = {
  title: "क्राइम की ताज़ा खबरें | Surya Bulletin",
  description:
    "अपराध, पुलिस कार्रवाई, जांच और कानून-व्यवस्था से जुड़ी ताज़ा खबरें पढ़ें।",
  alternates: {
    canonical: "https://suryabulletin.in/category/crime",
  },
};

export default function CrimePage() {
  return (
    <NewsListing
      title="क्राइम की खबरें"
      description="अपराध, पुलिस कार्रवाई और कानून-व्यवस्था से जुड़ी प्रमुख खबरें।"
      filterMode="keyword"
      filterTerms={[
        "क्राइम",
        "अपराध",
        "पुलिस",
        "गिरफ्तार",
        "हत्या",
        "Crime",
        "Police",
      ]}
    />
  );
}