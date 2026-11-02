import type { Metadata } from "next";
import styles from "./ContactUs.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Surya Bulletin",
  description:
    "Contact us for questions, concerns, or requests regarding our services and privacy policy.",
};

export default function ContactUsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>WE ARE HERE TO HELP</span>

          <h1>Contact Us</h1>

          <span className={styles.titleAccent} />

          <p className={styles.intro}>
            Have a question, concern, or request? We would love to hear from
            you. Reach out to us using the contact details below.
          </p>
        </header>

        <section className={styles.contactLayout}>
          <div className={styles.messagePanel}>
            <span className={styles.panelEyebrow}>GET IN TOUCH</span>

            <h2>Let&apos;s start a conversation.</h2>

            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy, please contact us. We will do our best to
              assist you.
            </p>

            <div className={styles.decorativeLine}>
              <span />
              <span />
              <span />
            </div>

            <p className={styles.brandName}>Surya Bulletin</p>
          </div>

          <div className={styles.detailsPanel}>
            <div className={styles.contactItem}>
              <div className={styles.iconBox} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>

              <div className={styles.contactText}>
                <span className={styles.label}>EMAIL US</span>

                <a href="mailto:suryabulletinofficial@gmail.com">
                  suryabulletinofficial@gmail.com
                </a>

                <p>For questions, concerns, and requests.</p>
              </div>
            </div>

            <div className={styles.contactDivider} />

            <div className={styles.contactItem}>
              <div className={styles.iconBox} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>

              <div className={styles.contactText}>
                <span className={styles.label}>OUR ADDRESS</span>

                <address>
                  Prince Enterprises,
                  <br />
                  Ghaziabad, Uttar Pradesh,
                  <br />
                  India
                </address>

              
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.bottomNote}>
          <span className={styles.noteIcon} aria-hidden="true">
            ✦
          </span>

          <p>
            Thank you for reaching out to{" "}
            <strong>Surya Bulletin.</strong>
          </p>
        </footer>
      </div>
    </main>
  );
}