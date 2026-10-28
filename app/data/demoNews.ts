
/**
 * Demo news data
 * Purpose: Firebase integration se pehle homepage ka design test karna.
 *
 * IMPORTANT:
 * Ye sample entries hain, actual published news nahi.
 * Inhe real news samajhkar publish mat karna.
 */

import type { News } from "../types/news";

export const DEMO_NEWS: News[] = [
  {
    id: "demo-1",
    slug: "desh-ki-aham-khabrein",
    title: "देश की अहम खबरें — पढ़ें दिनभर के प्रमुख अपडेट्स",
    excerpt:
      "देश की प्रमुख घटनाओं और जरूरी अपडेट्स के liye Surya Bulletin se jude rahein.",
    image: "/images/article-app.jpg",
    category: "भारत",
    publishedAt: "Demo story",
  },
  {
    id: "demo-2",
    slug: "samaj-shiksha-aur-log",
    title: "समाज, शिक्षा और आम लोगों से जुड़ी महत्वपूर्ण खबरें",
    excerpt:
      "आपके जीवन से जुड़ी जानकारियां और खास रिपोर्ट्स एक ही जगह।",
    image: "/images/magazine-app.jpg",
    category: "समाज",
    publishedAt: "Demo story",
  },
  {
    id: "demo-3",
    slug: "ghaziabad-local-news",
    title: "गाज़ियाबाद और आसपास की खबरों पर रखें नज़र",
    excerpt:
      "अपने शहर और आसपास के क्षेत्र की खबरों के लिए Surya Bulletin से जुड़े रहें।",
    image: "/images/join-us-app.jpg",
    category: "लोकल न्यूज़",
    publishedAt: "Demo story",
  },
];
