import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";

function Navbar() {
  const { list } = useBridalList();
  const { language, toggleLanguage, t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const contactRef = useRef(null);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  function closeMenu() {
    setMenuOpen(false);
    setContactOpen(false);
  }

  // ==========================================
  // TOGGLE CONTACT DROPDOWN
  // ==========================================

  function toggleContact() {
    setContactOpen((prev) => !prev);
  }

  // ==========================================
  // CLOSE CONTACT DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        contactRef.current &&
        !contactRef.current.contains(event.target)
      ) {
        setContactOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // CLOSE MENU WHEN ESCAPE IS PRESSED
  // ==========================================

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setContactOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ==========================================
  // PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  // ==========================================

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`navbar ${menuOpen ? "menu-is-open" : ""}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ==========================================
          NAVBAR CONTAINER
      ========================================== */}

      <div className="navbar-container">

        {/* ==========================================
            LOGO
        ========================================== */}

        <Link
          to="/home"
          className="logo"
          onClick={closeMenu}
        >
          <img
            src="/image/logo.jpg"
            alt="Ghaith Home"
            className="logo-image"
          />
        </Link>

        {/* ==========================================
            DESKTOP NAVIGATION
        ========================================== */}

        <div className="nav-links">

          <Link
            to="/home"
            onClick={closeMenu}
          >
            {t.nav.home}
          </Link>

          <Link
            to="/categories"
            onClick={closeMenu}
          >
            {t.nav.categories}
          </Link>

          <Link
            to="/checklist"
            onClick={closeMenu}
          >
            {t.nav.checklist}

            {list.length > 0 && (
              <span className="desktop-list-count">
                {list.length}
              </span>
            )}
          </Link>

          {/* ==========================================
              DESKTOP CONTACT
          ========================================== */}

          <div
            className="contact-wrapper"
            ref={contactRef}
          >
            <button
              type="button"
              className={`contact-btn ${
                contactOpen ? "active" : ""
              }`}
              onClick={toggleContact}
            >
              <span>Contact Us</span>

              <span
                className={`contact-chevron ${
                  contactOpen ? "rotate" : ""
                }`}
              >
                ↓
              </span>
            </button>

            {contactOpen && (
              <div className="contact-dropdown">

                <div className="contact-dropdown-header">
                  <span className="contact-small-label">
                    GET IN TOUCH
                  </span>

                  <span className="contact-title">
                    We'd love to hear from you.
                  </span>
                </div>

                {/* INSTAGRAM */}

                <a
                  href="https://www.instagram.com/ghaith._.home/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-option"
                  onClick={() => setContactOpen(false)}
                >
                  <span className="contact-option-icon">
                    ◎
                  </span>

                  <span className="contact-option-content">
                    <strong>Instagram</strong>
                    <small>@ghaith._.home</small>
                  </span>

                  <span className="contact-option-arrow">
                    ↗
                  </span>
                </a>

                {/* WHATSAPP */}

                <a
                  href="https://wa.me/96171523197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-option"
                  onClick={() => setContactOpen(false)}
                >
                  <span className="contact-option-icon">
                    ◌
                  </span>

                  <span className="contact-option-content">
                    <strong>WhatsApp</strong>
                    <small>+961 71 523 197</small>
                  </span>

                  <span className="contact-option-arrow">
                    ↗
                  </span>
                </a>

              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            RIGHT ACTIONS
        ========================================== */}

        <div className="nav-actions">

          {/* LANGUAGE */}

          <button
            type="button"
            className="language-btn"
            onClick={toggleLanguage}
          >
            <span className="language-symbol">
              ◎
            </span>

            <span>
              {language === "en"
                ? "العربية"
                : "English"}
            </span>
          </button>

          {/* BRIDAL LIST */}

          <Link
            to="/checklist"
            className="cart-btn"
            onClick={closeMenu}
            aria-label="Bridal list"
          >
            <span className="cart-icon">
              ♡
            </span>

            {list.length > 0 && (
              <span className="cart-count">
                {list.length}
              </span>
            )}
          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setContactOpen(false);
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={
                menuOpen
                  ? "menu-icon close-icon"
                  : "menu-icon"
              }
            >
              {menuOpen ? "×" : "☰"}
            </span>
          </button>

        </div>
      </div>

      {/* ==========================================
          MOBILE MENU
      ========================================== */}

      <div
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >

        {/* HOME */}

        <Link
          to="/home"
          onClick={closeMenu}
        >
          <span>
            {t.nav.home}
          </span>

          <span className="mobile-arrow">
            →
          </span>
        </Link>

        {/* CATEGORIES */}

        <Link
          to="/categories"
          onClick={closeMenu}
        >
          <span>
            {t.nav.categories}
          </span>

          <span className="mobile-arrow">
            →
          </span>
        </Link>

        {/* CHECKLIST */}

        <Link
          to="/checklist"
          onClick={closeMenu}
        >
          <span className="mobile-checklist-name">

            {t.nav.checklist}

            {list.length > 0 && (
              <span className="mobile-list-count">
                {list.length}
              </span>
            )}

          </span>

          <span className="mobile-arrow">
            →
          </span>
        </Link>

        {/* ==========================================
            MOBILE CONTACT
        ========================================== */}

        <div className="mobile-contact-section">

          <button
            type="button"
            className="mobile-contact-btn"
            onClick={toggleContact}
          >
            <span>
              Contact Us
            </span>

            <span>
              {contactOpen ? "↑" : "↓"}
            </span>
          </button>

          {contactOpen && (
            <div className="mobile-contact-options">

              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/ghaith._.home/"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-contact-option"
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(false);
                }}
              >
                <span className="mobile-contact-icon">
                  ◎
                </span>

                <span className="mobile-contact-name">
                  Instagram
                </span>

                <span className="mobile-contact-arrow">
                  ↗
                </span>
              </a>

              {/* WHATSAPP */}

              <a
                href="https://wa.me/96171523197"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-contact-option"
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(false);
                }}
              >
                <span className="mobile-contact-icon">
                  ◌
                </span>

                <span className="mobile-contact-name">
                  WhatsApp
                </span>

                <span className="mobile-contact-arrow">
                  ↗
                </span>
              </a>

            </div>
          )}
        </div>

        {/* ==========================================
            MOBILE LANGUAGE
        ========================================== */}

        <button
          type="button"
          className="mobile-language-btn"
          onClick={() => {
            toggleLanguage();
            closeMenu();
          }}
        >
          <span>
            {language === "en"
              ? "العربية"
              : "English"}
          </span>

          <span>
            ◎
          </span>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;