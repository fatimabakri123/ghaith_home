
import "./role.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RolePage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");

  const isArabic = language === "ar";

  const content = {
    en: {
      brand: "GHAITH HOME",
      navHome: "Home",
      navCollections: "Collections",
      navAbout: "About",
      language: "العربية",

      eyebrow: "YOUR HOME, YOUR STYLE",
      title: "Everything Your Home Needs.",
      description:
        "Discover beautiful pieces and collections made to make your home feel truly yours.",

      shop: "Shop Collection",
      owner: "Store Owner",

    

      
    },

    ar: {
      brand: "غيث هوم",
      navHome: "الرئيسية",
      navCollections: "المجموعات",
      navAbout: "من نحن",
      language: "English",

      eyebrow: "بيتك، أسلوبك",
      title: "كل ما يحتاجه بيتك.",
      description:
        "اكتشف قطعاً ومجموعات جميلة صُممت لتجعل منزلك يعكس ذوقك وشخصيتك.",

      shop: "تصفح المجموعة",
      owner: "صاحب المتجر",

      scroll: "اكتشف المزيد",

      statOne: "جودة",
      statTwo: "مجموعات",
      statThree: "مصممة للمنزل",
    },
  };

  const t = content[language];

  const handleRole = (role) => {
    if (role === "customer") {
      navigate("/home");
    }

    if (role === "owner") {
      navigate("/admin/login");
    }
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="role-page"
    >
      {/* Background Image */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="role-navbar">
        <div className="navbar-brand">
          <span className="brand-main">GHAITH</span>
          <span className="brand-sub">HOME</span>
        </div>

        <div className="navbar-links">
          <button className="nav-link active">
            {t.navHome}
          </button>

          <button
            className="nav-link"
            onClick={() => handleRole("customer")}
          >
            {t.navCollections}
          </button>

          <button className="nav-link">
            {t.navAbout}
          </button>
        </div>

        <button
          className="language-button"
          onClick={() =>
            setLanguage(language === "en" ? "ar" : "en")
          }
        >
          <span className="language-icon">◎</span>
          {t.language}
        </button>
      </nav>

      {/* Hero */}
      <section className="role-hero">
        <div className="hero-content">

          <p className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            {t.eyebrow}
          </p>

          <h1 className="hero-title">
            {t.title}
          </h1>

          <p className="hero-description">
            {t.description}
          </p>

          <div className="hero-actions">

            <button
              className="primary-button"
              onClick={() => handleRole("customer")}
            >
              <span>{t.shop}</span>
              <span className="button-arrow">
                {isArabic ? "←" : "→"}
              </span>
            </button>

            <button
              className="secondary-button"
              onClick={() => handleRole("owner")}
            >
              {t.owner}
            </button>

          </div>
        </div>
      </section>

      {/* Bottom Information */}
      <div className="hero-bottom">

        <div className="scroll-indicator">
          <span className="scroll-line"></span>
          <span>{t.scroll}</span>
        </div>

        <div className="hero-stats">

          

        </div>
      </div>
    </main>
  );
}

