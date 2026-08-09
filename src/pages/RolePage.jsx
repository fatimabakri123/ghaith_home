
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RolePage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");

  const isArabic = language === "ar";

  const content = {
    en: {
      brand: "SMA",
      title: "Welcome",
      subtitle: "Please choose how you want to continue",
      customer: "Customer",
      customerDesc: "Browse products and explore our store",
      owner: "Owner",
      ownerDesc: "Manage your products and store",
      language: "العربية",
    },

    ar: {
      brand: "SMA",
      title: "مرحباً",
      subtitle: "يرجى اختيار طريقة المتابعة",
      customer: "زبون",
      customerDesc: "تصفح المنتجات واستكشف متجرنا",
      owner: "صاحب المتجر",
      ownerDesc: "إدارة المنتجات والمتجر الخاص بك",
      language: "English",
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
      <div className="role-container">

        {/* Language */}
        <div className="language-wrapper">
          <button
            onClick={() =>
              setLanguage(language === "en" ? "ar" : "en")
            }
            className="language-button"
          >
            🌐 {t.language}
          </button>
        </div>

        {/* Header */}
        <div className="role-header">

          <h2 className="brand-name">
            {t.brand}
          </h2>

          <div className="brand-line"></div>

          <h1 className="role-title">
            {t.title}
          </h1>

          <p className="role-subtitle">
            {t.subtitle}
          </p>

        </div>

        {/* Cards */}
        <div className="role-cards">

          {/* Customer */}
          <button
            onClick={() => handleRole("customer")}
            className="role-card"
          >
            <div className="role-icon">
              🛍️
            </div>

            <h2 className="role-card-title">
              {t.customer}
            </h2>

            <p className="role-card-description">
              {t.customerDesc}
            </p>

            <div className="role-arrow">
              →
            </div>
          </button>

          {/* Owner */}
          <button
            onClick={() => handleRole("owner")}
            className="role-card"
          >
            <div className="role-icon">
              🏪
            </div>

            <h2 className="role-card-title">
              {t.owner}
            </h2>

            <p className="role-card-description">
              {t.ownerDesc}
            </p>

            <div className="role-arrow">
              →
            </div>
          </button>

        </div>
      </div>
    </main>
  );
}

