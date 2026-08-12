import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";

function Navbar() {
  const { list } = useBridalList();
  const { language, toggleLanguage, t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <img
            src="/image/logo.jpg"
            alt="Gaith Home"
            className="logo-image"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="nav-links">

          <Link to="/home" onClick={closeMenu}>
            {t.nav.home}
          </Link>

          <Link to="/categories" onClick={closeMenu}>
            {t.nav.categories}
          </Link>

          <Link to="/checklist" onClick={closeMenu}>
            {t.nav.checklist}
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {/* DESKTOP LANGUAGE */}
          <button
            className="language-btn"
            onClick={toggleLanguage}
          >
            {language === "en" ? "العربية" : "English"}
          </button>

          {/* BRIDAL LIST */}
          <Link
            to="/checklist"
            className="cart-btn"
            onClick={closeMenu}
          >
            🛍️

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
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu open">

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
              <span className="mobile-list-count">
                {list.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="mobile-language-btn"
            onClick={() => {
              toggleLanguage();
              closeMenu();
            }}
          >
            {language === "en" ? "العربية" : "English"}
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;