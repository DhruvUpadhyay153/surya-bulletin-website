/**
 * Firebase connection file — Surya Bulletin Website
 *
 * 1. Reuses the existing Firebase project.
 * 2. Connects to the default Cloud Firestore database.
 * 3. Logs diagnostic information to help troubleshoot news loading.
 *
 * Security:
 * Never store admin passwords or service-account private keys here.
 * Firebase configuration is loaded from .env.local.
 */

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyBlfcmiChofX4NSN6g6fx-W53zLbO4WHjI",
  authDomain: "surya-bullettin.firebaseapp.com",
  projectId: "surya-bullettin",
  storageBucket: "surya-bullettin.firebasestorage.app",
  messagingSenderId: "1040850156302",
  appId: "1:1040850156302:web:ef0c589ad603ce6f8bf55f"
};

// Check required Firebase configuration.
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  throw new Error(
    "[Surya Bulletin] Firebase configuration is incomplete. Check .env.local."
  );
}

// Reuse the existing Firebase app if already initialized.
const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// Connect to the default Firestore database.
export const db = getFirestore(firebaseApp);

// Temporary diagnostic information.
console.info(
  "[Surya Bulletin] Firebase project ID:",
  firebaseApp.options.projectId
);

console.info(
  "[Surya Bulletin] Firestore database:",
  db.app.name,
  "(default database)"
);

/**
 * Temporary diagnostic function:
 * Call this function to test whether the website can read documents
 * from the news collection.
 */
export async function testNewsFirestoreConnection() {
  try {
    console.info("[Surya Bulletin] Testing Firestore news connection...");

    const newsQuery = query(collection(db, "news"), limit(5));
    const snapshot = await getDocs(newsQuery);

    console.info(
      "[Surya Bulletin] News documents received:",
      snapshot.size
    );

    console.table(
      snapshot.docs.map((document) => ({
        documentId: document.id,
        title: document.data().title ?? "(No title)",
        published: document.data().published,
        status: document.data().status,
      }))
    );

    return snapshot.size;
  } catch (error) {
    console.error(
      "[Surya Bulletin] Firestore connection test failed:",
      error
    );

    throw error;
  }
}
