import type { Metadata } from "next";
import { Cinzel, Marcellus, Noto_Sans_Devanagari } from "next/font/google";

import "./globals.css";
import "./news-article.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suryabulletin.in"),

  title: {
    default: "Surya Bulletin | ताज़ा खबरें, खास कहानियाँ",
    template: "%s | Surya Bulletin",
  },

  description:
    "Surya Bulletin पर पढ़ें भारत, दुनिया, राजनीति, मनोरंजन, क्राइम और आपके शहर की ताज़ा खबरें।",

  applicationName: "Surya Bulletin",

  openGraph: {
  type: "website",
  locale: "hi_IN",
  siteName: "Surya Bulletin",
  url: "https://suryabulletin.in",
  title: "Surya Bulletin | ताज़ा खबरें, खास कहानियाँ",
  description: "ताज़ा खबरें। खास कहानियाँ। आपका भरोसा।",
  images: [
    {
      url: "/images/logo.png",
      alt: "Surya Bulletin Logo",
    },
  ],
},
  twitter: {
  card: "summary",
  title: "Surya Bulletin | ताज़ा खबरें, खास कहानियाँ",
  description: "ताज़ा खबरें। खास कहानियाँ। आपका भरोसा।",
  images: ["/images/logo.png"],
},

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${cinzel.variable} ${marcellus.variable} ${notoSansDevanagari.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}