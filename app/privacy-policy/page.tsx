import type { Metadata } from "next";
import styles from "./PrivacyPolicy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Surya Bulletin",
  description:
    "Read the Privacy Policy of Surya Bulletin to understand how we collect, use, store, and protect your information.",
  robots: {
    index: true,
    follow: true,
  },
};

const privacySections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        This Privacy Policy explains how Prince Enterprises, the operator of
        Surya Bulletin, collects, uses, stores, and protects information when
        you use the Surya Bulletin application.
      </p>
    ),
  },
  {
    title: "2. Information We Collect",
    content: (
      <p>
        Surya Bulletin may collect limited information required to provide and
        improve the application. This may include your mobile number and,
        where voluntarily provided, your name. We may also receive basic
        technical information required for the operation, security, and
        performance of the application.
      </p>
    ),
  },
  {
    title: "3. Mobile Number",
    content: (
      <p>
        A mobile number may be requested when you first use the application.
        The mobile number is used to identify your application profile and
        provide a consistent user experience. We do not use your mobile
        number for unrelated purposes without an appropriate basis or your
        consent where required by applicable law.
      </p>
    ),
  },
  {
    title: "4. Name",
    content: (
      <p>
        Providing your name may be optional. If you choose to provide your
        name, it may be stored with your application profile and used to
        personalize your experience within Surya Bulletin.
      </p>
    ),
  },
  {
    title: "5. Feedback",
    content: (
      <p>
        If you submit feedback through the application, we may collect the
        mobile number you provide and the feedback message. This information
        is used to understand user experiences, identify issues, and improve
        Surya Bulletin.
      </p>
    ),
  },
  {
    title: "6. How We Use Information",
    content: (
      <p>
        Information collected through Surya Bulletin may be used to provide
        and maintain the application, personalize the user experience,
        respond to feedback, improve application features and performance,
        maintain security, troubleshoot technical issues, and comply with
        applicable legal requirements.
      </p>
    ),
  },
  {
    title: "7. News & Content",
    content: (
      <p>
        Surya Bulletin provides news, articles, videos, magazines, and other
        informational content. Some content may originate from external
        sources or third-party platforms. Your interaction with external
        content may be subject to the privacy policies and terms of those
        third parties.
      </p>
    ),
  },
  {
    title: "8. Third-Party Services",
    content: (
      <p>
        Surya Bulletin may use third-party technology and services to operate
        the application, including Firebase services for application data
        and backend functionality. Third-party service providers may process
        information according to their own terms and privacy policies.
      </p>
    ),
  },
  {
    title: "9. Firebase Services",
    content: (
      <p>
        The application may use Firebase services provided by Google for
        features such as authentication, database storage, application
        functionality, and related backend services. Information stored
        through these services is handled using the applicable security and
        privacy mechanisms provided by those services.
      </p>
    ),
  },
  {
    title: "10. Data Sharing",
    content: (
      <p>
        We do not sell your personal information. Information may be shared
        with service providers where reasonably necessary to operate,
        maintain, secure, or improve the application, or where disclosure is
        required by applicable law, legal process, or a legitimate
        governmental request.
      </p>
    ),
  },
  {
    title: "11. Data Security",
    content: (
      <p>
        We take reasonable measures to protect information handled through
        Surya Bulletin against unauthorized access, misuse, alteration,
        disclosure, or destruction. However, no electronic storage or
        transmission method can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    title: "12. Data Retention",
    content: (
      <p>
        We retain information for as long as reasonably necessary to provide
        the application, maintain records, improve our services, resolve
        disputes, enforce applicable terms, and meet legal or operational
        requirements. Retention periods may vary depending on the type and
        purpose of the information.
      </p>
    ),
  },
  {
    title: "13. Children's Privacy",
    content: (
      <p>
        Surya Bulletin is a general news and information application. We do
        not knowingly collect personal information from children in
        violation of applicable laws. If you believe that a child has
        provided personal information improperly, please contact us so that
        appropriate action can be considered.
      </p>
    ),
  },
  {
    title: "14. External Links",
    content: (
      <p>
        The application may contain links to external websites, social media
        platforms, videos, or other services. We are not responsible for the
        privacy practices, security, or content of those external services.
        We encourage users to review the privacy policies of external
        websites and services they visit.
      </p>
    ),
  },
  {
    title: "15. Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect
        changes in the application, technology, legal requirements, or our
        practices. Any updated version may be made available through the
        application or other appropriate channels.
      </p>
    ),
  },
  {
    title: "16. Your Rights",
    content: (
      <p>
        Depending on applicable law, you may have rights relating to your
        personal information, including the right to request access,
        correction, or deletion of certain information. To make a
        privacy-related request, please contact us using the details
        provided below.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>
            SURYA BULLETIN · LEGAL
          </span>

          <h1>Privacy Policy</h1>

          <span className={styles.titleAccent} />

          <p className={styles.intro}>
            Your privacy matters to us. This policy explains how information
            is handled when you use Surya Bulletin.
          </p>

          <div className={styles.updated}>
            <span className={styles.updatedDot} />
            Last Updated: September 2026
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <span className={styles.sidebarLabel}>IN THIS POLICY</span>

              <nav aria-label="Privacy Policy sections">
                <a href="#introduction">Introduction</a>
                <a href="#information">Information We Collect</a>
                <a href="#mobile-number">Mobile Number</a>
                <a href="#name">Name</a>
                <a href="#feedback">Feedback</a>
                <a href="#information-use">How We Use Information</a>
                <a href="#news-content">News & Content</a>
                <a href="#third-party">Third-Party Services</a>
                <a href="#firebase">Firebase Services</a>
                <a href="#data-sharing">Data Sharing</a>
                <a href="#security">Data Security</a>
                <a href="#retention">Data Retention</a>
                <a href="#children">Children&apos;s Privacy</a>
                <a href="#external-links">External Links</a>
                <a href="#policy-changes">Policy Changes</a>
                <a href="#your-rights">Your Rights</a>
                <a href="#contact">Contact Us</a>
              </nav>
            </div>
          </aside>

          <article className={styles.policy}>
            {privacySections.map((section, index) => {
              const ids = [
                "introduction",
                "information",
                "mobile-number",
                "name",
                "feedback",
                "information-use",
                "news-content",
                "third-party",
                "firebase",
                "data-sharing",
                "security",
                "retention",
                "children",
                "external-links",
                "policy-changes",
                "your-rights",
              ];

              return (
                <section
                  className={styles.section}
                  id={ids[index]}
                  key={section.title}
                >
                  <h2>{section.title}</h2>
                  <div className={styles.sectionContent}>
                    {section.content}
                  </div>
                </section>
              );
            })}

            <section
              className={`${styles.section} ${styles.contactSection}`}
              id="contact"
            >
              <h2>17. Contact Us</h2>

              <p className={styles.contactIntro}>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or the handling of your information, please
                contact us at:
              </p>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon} aria-hidden="true">
                  @
                </div>

                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>
                    POLICY & PRIVACY ENQUIRIES
                  </span>

                  <h3>Prince Enterprises</h3>
                  <p>Surya Bulletin</p>
                  <p>Ghaziabad, Uttar Pradesh, India</p>

                  <a
                    className={styles.emailLink}
                    href="mailto:suryabulletinofficial@gmail.com"
                  >
                    suryabulletinofficial@gmail.com
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </div>
              </div>
            </section>

            <div className={styles.closing}>
              <span className={styles.closingLine} />
              <p>
                Thank you for trusting <strong>Surya Bulletin</strong>.
              </p>
              <span className={styles.closingLine} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}