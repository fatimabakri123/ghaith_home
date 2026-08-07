import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";

function Navbar() {
    const { list } = useBridalList();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          Bridal Home
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/">{t.nav.home}</Link>

          <Link to="/categories">
            {t.nav.categories}
          </Link>

          <Link to="/checklist">
            {t.nav.checklist}
          </Link>

         

          <Link to="/about">
            {t.nav.about}
          </Link>
        </div>

        {/* Right Side */}
        <div className="nav-actions">

          {/* Language */}
          <button
            className="language-btn"
            onClick={toggleLanguage}
          >
            {language === "en" ? "العربية" : "English"}
          </button>

          {/* Cart / Bridal List */}
         <Link to="/checklist" className="cart-btn">

  🛍️

  {list.length > 0 && (
    <span className="cart-count">
      {list.length}
    </span>
  )}

</Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;