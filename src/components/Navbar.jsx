import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";
import "./navbar.css";
function Navbar() {
  const { list } = useBridalList();
  const { language, toggleLanguage, t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const contactRef = useRef(null);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleContact() {
    setContactOpen((prev) => !prev);
  }

  // Close contact box when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        contactRef.current &&
        !contactRef.current.contains(event.target)
      ) {
        setContactOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav
      className={`navbar ${
        menuOpen ? "menu-is-open" : ""
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="navbar-container">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          className="logo"
          onClick={() => {
            closeMenu();
            setContactOpen(false);
          }}
        >
          <img
            src="/image/logo.jpg"
            alt="Ghaith Home"
            className="logo-image"
          />
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

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


          {/* =================================================
              CONTACT US
          ================================================= */}

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
              <span>
                Contact Us
              </span>

              <span
                className={`contact-chevron ${
                  contactOpen ? "rotate" : ""
                }`}
              >
                ↓
              </span>
            </button>


            {/* CONTACT DROPDOWN */}

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
                  href="https://www.instagram.com/ghaith._.home?stkn=djd6MHg4bXE4N3h3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-option"
                  onClick={() =>
                    setContactOpen(false)
                  }
                >
                  <span className="contact-option-icon">
                    ◎
                  </span>

                  <span className="contact-option-content">
                    <strong>
                      Instagram
                    </strong>

                    <small>
                      @ghaith._.home
                    </small>
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
                  onClick={() =>
                    setContactOpen(false)
                  }
                >
                  <span className="contact-option-icon">
                    ◌
                  </span>

                  <span className="contact-option-content">
                    <strong>
                      WhatsApp
                    </strong>

                    <small>
                      +961 71 523 197
                    </small>
                  </span>

                  <span className="contact-option-arrow">
                    ↗
                  </span>
                </a>

              </div>
            )}
          </div>

        </div>


        {/* =====================================================
            RIGHT ACTIONS
        ===================================================== */}

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


          {/* MOBILE MENU */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
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


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >

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


        {/* MOBILE CONTACT */}

        {/* MOBILE CONTACT */}

<div className="mobile-contact-section">

  <button
    type="button"
    className="mobile-contact-btn"
    onClick={() => setContactOpen((prev) => !prev)}
  >
    <span>Contact Us</span>

    <span>
      {contactOpen ? "↑" : "↓"}
    </span>
  </button>

  {contactOpen && (
    <div className="mobile-contact-options">

      {/* INSTAGRAM */}
      <button
        type="button"
        onClick={() => {
          window.open(
            "https://www.instagram.com/ghaith._.home/",
            "_blank",
            "noopener,noreferrer"
          );

          setContactOpen(false);
          setMenuOpen(false);
        }}
      >
        <span>◎</span>

        <span>Instagram</span>

        <span>↗</span>
      </button>


      {/* WHATSAPP */}
      <button
        type="button"
        onClick={() => {
          window.open(
            "https://wa.me/96171523197",
            "_blank",
            "noopener,noreferrer"
          );

          setContactOpen(false);
          setMenuOpen(false);
        }}
      >
        <span>◌</span>

        <span>WhatsApp</span>

        <span>↗</span>
      </button>

    </div>
  )}

</div>

        {/* MOBILE LANGUAGE */}

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