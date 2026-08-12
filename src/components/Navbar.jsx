import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";

function Navbar() {
  const { list } = useBridalList();
  const { language, toggleLanguage, t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActive(path) {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }

    return location.pathname.startsWith(path);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

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

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <div className="nav-links">

          <Link
            to="/home"
            className={isActive("/home") ? "active" : ""}
            onClick={closeMenu}
          >
            {t.nav.home}
          </Link>

          <Link
            to="/categories"
            className={isActive("/categories") ? "active" : ""}
            onClick={closeMenu}
          >
            {t.nav.categories}
          </Link>

          <Link
            to="/checklist"
            className={isActive("/checklist") ? "active" : ""}
            onClick={closeMenu}
          >
            {t.nav.checklist}
          </Link>

        </div>

        {/* =========================
            RIGHT ACTIONS
        ========================= */}

        <div className="nav-actions">

          {/* Language */}

          <button
            type="button"
            className="language-btn"
            onClick={toggleLanguage}
          >
            {language === "en" ? "العربية" : "English"}
          </button>

          {/* Bridal List */}

          <Link
            to="/checklist"
            className="cart-btn"
            onClick={closeMenu}
            aria-label="Bridal checklist"
          >
            🛍️

            {list && list.length > 0 && (
              <span className="cart-count">
                {list.length}
              </span>
            )}
          </Link>

          {/* Mobile Button */}

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

      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (
        <div className="mobile-menu">

          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={closeMenu}
          >
            {t.nav.home}
          </Link>

          <Link
            to="/categories"
            className={isActive("/categories") ? "active" : ""}
            onClick={closeMenu}
          >
            {t.nav.categories}
          </Link>

          <Link
            to="/checklist"
            className={isActive("/checklist") ? "active" : ""}
            onClick={closeMenu}
          >
            {t.nav.checklist}
          </Link>

          {/* Mobile Language */}

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