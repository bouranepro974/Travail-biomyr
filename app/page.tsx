import Cinematic from "@/components/Cinematic";
import { NAV, CONTACT, HERO } from "@/lib/content";

export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <nav className="nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="nav__logo" src="/logos/biomyr.svg" alt="BIOMYR" />
        <div className="nav__links">
          {NAV.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </nav>

      {/* Expérience cinématique pilotée par le scroll */}
      <Cinematic />

      {/* Contact / footer */}
      <footer id="contact" className="footer">
        <div className="footer__grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer__logo" src="/logos/biomyr.svg" alt="BIOMYR" />
            <p className="body-text" style={{ maxWidth: 460 }}>
              {HERO.subtitle}
            </p>
          </div>
          <div className="footer__contact">
            <p><strong>Adresse</strong><br />{CONTACT.address}</p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Téléphone</strong><br />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
            </p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Email</strong><br />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} BIOMYR — Innover. Développer. Collaborer.</span>
          <span>Biosolutions à base de biopolymères · La Réunion</span>
        </div>
      </footer>
    </main>
  );
}
