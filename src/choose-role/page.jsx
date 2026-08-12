"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Store,
  Languages,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ChooseRolePage() {
  const router = useRouter();

  const [language, setLanguage] = useState("en");

  const isArabic = language === "ar";

  const content = {
    en: {
      brand: "GHAITH HOME",
      smallText: "A beautiful beginning starts here",
      title: "Welcome",
      subtitle:
        "Choose how you would like to continue and discover your perfect experience.",
      customer: "Customer",
      customerDesc:
        "Browse beautiful products, discover collections, and find everything for your new home.",
      owner: "Store Owner",
      ownerDesc:
        "Manage your products, collections, and store with ease.",
      customerButton: "Enter Store",
      ownerButton: "Manage Store",
      language: "العربية",
    },

    ar: {
      brand: "بيت العروس",
      smallText: "بداية جميلة تبدأ من هنا",
      title: "مرحباً بكِ",
      subtitle:
        "اختاري الطريقة التي تريدين المتابعة بها واكتشفي تجربتك المثالية.",
      customer: "الزبون",
      customerDesc:
        "تصفحي المنتجات والمجموعات واكتشفي كل ما تحتاجينه لبيتك الجديد.",
      owner: "صاحب المتجر",
      ownerDesc:
        "إدارة المنتجات والمجموعات والمتجر الخاص بك بسهولة.",
      customerButton: "دخول إلى المتجر",
      ownerButton: "إدارة المتجر",
      language: "English",
    },
  };

  const t = content[language];

  const handleRole = (role) => {
    if (role === "customer") {
      router.push("/home");
    }

    if (role === "owner") {
      router.push("/admin/login");
    }
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="choose-role-page"
    >
      {/* Background decoration */}
      <div className="choose-background">
        <div className="glow glow-top" />
        <div className="glow glow-left" />
        <div className="glow glow-right" />

        <div className="decor-dot dot-one" />
        <div className="decor-dot dot-two" />
        <div className="decor-dot dot-three" />

        <div className="decor-ring ring-one" />
        <div className="decor-ring ring-two" />
      </div>

      <div className="choose-container">

        {/* TOP BAR */}
        <div className="choose-topbar">

          {/* BRAND */}
          <div className="choose-brand">

            <div className="brand-icon">
              <Sparkles size={18} />
            </div>

            <div>
              <p className="brand-name">
                {t.brand}
              </p>

              <p className="brand-year">
                EST. 2026
              </p>
            </div>

          </div>

          {/* LANGUAGE */}
          <button
            className="language-switch"
            onClick={() =>
              setLanguage(
                language === "en" ? "ar" : "en"
              )
            }
          >
            <Languages size={16} />

            <span>{t.language}</span>
          </button>

        </div>

        {/* HERO */}
        <section className="choose-hero">

          <div className="hero-small-text">
            <span />
            <p>{t.smallText}</p>
            <span />
          </div>

          <h1>
            {t.title}
          </h1>

          <div className="hero-star-line">
            <span />
            <b>✦</b>
            <span />
          </div>

          <p className="hero-description">
            {t.subtitle}
          </p>

        </section>

        {/* ROLE CARDS */}
        <section className="role-cards">

          {/* CUSTOMER */}
          <button
            className="role-card customer-card"
            onClick={() => handleRole("customer")}
          >

            <div className="card-glow" />

            <div className="role-icon">
              <User
                size={34}
                strokeWidth={1.5}
              />
            </div>

            <h2>
              {t.customer}
            </h2>

            <p>
              {t.customerDesc}
            </p>

            <div className="role-button">
              <span>
                {t.customerButton}
              </span>

              <ArrowRight size={15} />
            </div>

          </button>

          {/* OWNER */}
          <button
            className="role-card owner-card"
            onClick={() => handleRole("owner")}
          >

            <div className="card-glow owner-glow" />

            <div className="role-icon owner-icon">
              <Store
                size={34}
                strokeWidth={1.5}
              />
            </div>

            <h2>
              {t.owner}
            </h2>

            <p>
              {t.ownerDesc}
            </p>

            <div className="role-button owner-button">
              <span>
                {t.ownerButton}
              </span>

              <ArrowRight size={15} />
            </div>

          </button>

        </section>

        {/* FOOTER */}
        <footer className="choose-footer">
          Made for beautiful beginnings
        </footer>

      </div>
    </main>
  );
}