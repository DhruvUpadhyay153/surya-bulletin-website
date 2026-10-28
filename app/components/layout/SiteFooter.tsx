import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "../../constants/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        {/* Main footer */}
        <div className="footer-main">
          {/* Brand section */}
          <div className="footer-brand">
            <Link href="/" className="footer-brand-logo">
              <Image
                src="/images/logo.png"
                alt="Surya Bulletin"
                width={250}
                height={90}
                className="footer-logo-image"
                priority
              />
            </Link>

            <p className="footer-tagline">
              सच जो दिल दहला दे।
            </p>

            <p className="footer-description">
              देश, दुनिया, समाज और धर्म से जुड़ी अहम खबरें
              सरल भाषा में पढ़ें। खबरों से जुड़े रहें,
              जागरूक रहें।
            </p>

            {/* Google Play Store image button */}
            <Link
              href={SITE_CONFIG.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-app-button"
              aria-label="Surya Bulletin ऐप डाउनलोड करें"
              title="ऐप डाउनलोड करें"
            >
              <Image
                src="/images/playstoreicon.webp"
                alt="Get it on Google Play"
                width={150}
                height={45}
                sizes="150px"
                style={{
                  width: "150px",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </Link>
          </div>

          {/* Quick links */}
          <div className="footer-links-column">
            <h2>Quick Links</h2>

            <nav aria-label="Footer navigation">
              <Link href="/">घर</Link>
              <Link href="/#categories">खबरें पढ़ें</Link>
              <Link href="/#trending">ट्रेंडिंग विषय</Link>
              <Link href="/#about">हमारे बारे में</Link>
            </nav>
          </div>

          {/* Support and policies */}
          <div className="footer-links-column">
            <h2>Support & Policies</h2>

            <nav aria-label="Support and policies">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/contact-us">Contact Us</Link>
            </nav>

            <p className="footer-help-text">
              कोई सुझाव या सवाल है?
              <br />
              हमसे संपर्क करें।
            </p>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Surya Bulletin.
            All rights reserved.
          </p>

          <p className="footer-bottom-tagline">
            खबरें साफ़, नज़र साफ़।
          </p>
        </div>
      </div>
    </footer>
  );
}