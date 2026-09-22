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
      smallBrand: "HOME COLLECTION",
      title: "Welcome to Ghaith Home",
      subtitle: "Everything you need to make your home feel like home.",
      choose: "Continue as",
      customer: "Customer",
      customerDesc: "Explore our collection",
      owner: "Owner",
      ownerDesc: "Manage your store",
      language: "العربية",
      discover: "DISCOVER",
      manage: "MANAGE",
    },

    ar: {
      brand: "غيث هوم",
      smallBrand: "مجموعة المنزل",
      title: "مرحباً بك في غيث هوم",
      subtitle: "كل ما تحتاجه لتجعل منزلك أكثر دفئاً وأناقة.",
      choose: "المتابعة كـ",
      customer: "زبون",
      customerDesc: "اكتشف مجموعتنا",
      owner: "صاحب المتجر",
      ownerDesc: "إدارة المتجر",
      language: "English",
      discover: "اكتشف",
      manage: "إدارة",
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
      className="role-page"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="role-background">
        <div className="role-background-image" />
        <div className="role-overlay" />
      </div>

      {/* ==========================================
          TOP BAR
      ========================================== */}

      <header className="role-topbar">

        <div className="role-mini-brand">
          <span>{t.brand}</span>
          <small>{t.smallBrand}</small>
        </div>

        <button
          type="button"
          className="role-language"
          onClick={() =>
            setLanguage(
              language === "en" ? "ar" : "en"
            )
          }
        >
          <span>◎</span>
          {t.language}
        </button>

      </header>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="role-content">

        {/* BRAND */}

        <div className="role-brand">

          <span className="role-brand-small">
            EST. 2026
          </span>

          <h1>{t.brand}</h1>

          <div className="role-brand-line">
            <span></span>
            <i>✦</i>
            <span></span>
          </div>

          <p>{t.smallBrand}</p>

        </div>

        {/* TITLE */}

        <div className="role-heading">

          <span className="role-eyebrow">
            {t.choose}
          </span>

          <h2>
            {t.title}
          </h2>

          <p>
            {t.subtitle}
          </p>

        </div>

        {/* ==========================================
            ROLE OPTIONS
        ========================================== */}

        <div className="role-options">

          {/* CUSTOMER */}

          <button
            type="button"
            className="role-option"
            onClick={() => handleRole("customer")}
          >
            <div className="role-option-top">
              <span className="role-option-number">
                01
              </span>

              <span className="role-option-label">
                {t.discover}
              </span>
            </div>

            <div className="role-option-main">

              <div>
                <h3>{t.customer}</h3>

                <p>
                  {t.customerDesc}
                </p>
              </div>

              <span className="role-option-arrow">
                ↗
              </span>

            </div>
          </button>

          {/* OWNER */}

          <button
            type="button"
            className="role-option"
            onClick={() => handleRole("owner")}
          >
            <div className="role-option-top">
              <span className="role-option-number">
                02
              </span>

              <span className="role-option-label">
                {t.manage}
              </span>
            </div>

            <div className="role-option-main">

              <div>
                <h3>{t.owner}</h3>

                <p>
                  {t.ownerDesc}
                </p>
              </div>

              <span className="role-option-arrow">
                ↗
              </span>

            </div>
          </button>

        </div>

      </div>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="role-footer">

        <span>
          GHAITH HOME
        </span>

        <span>
          {isArabic
            ? "منزلك يبدأ من هنا"
            : "YOUR HOME STARTS HERE"}
        </span>

        <span>
          © 2026
        </span>

      </footer>

    </main>
  );
}