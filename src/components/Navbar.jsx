
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

        {/* Logo */}
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

        {/* Desktop Navigation */}
        <div className="nav-links">

          <Link to="/home" onClick={closeMenu}>
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
          </Link>

         

        </div>

        {/* Right Side */}
        <div className="nav-actions">

          {/* Language */}
          <button
            className="language-btn"
            onClick={toggleLanguage}
          >
            {language === "en"
              ? "العربية"
              : "English"}
          </button>

          {/* Bridal List */}
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

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">

          <Link
            to="/"
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
          </Link>

         

          {/* Mobile Language */}
          <button
            className="mobile-language-btn"
            onClick={() => {
              toggleLanguage();
              closeMenu();
            }}
          >
            {language === "en"
              ? "العربية"
              : "English"}
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;

