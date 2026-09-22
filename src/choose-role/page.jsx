"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Languages,
  Menu,
  X,
} from "lucide-react";

export default function ChooseRolePage() {
  const router = useRouter();

  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

  const isArabic = language === "ar";

  const content = {
    en: {
      brand: "GHAITH HOME",

      nav: {
        home: "Home",
        collections: "Collections",
        about: "About Us",
        contact: "Contact",
      },

      smallText: "A HOME MADE FOR YOU",

      title: (
        <>
          Everything
          <br />
          Your Home
          <br />
          <span>Needs.</span>
        </>
      ),

      description:
        "Discover beautiful pieces, thoughtful collections, and everything you need to create a home that feels truly yours.",

      shop: "Shop Collection",
      owner: "Store Owner",

      stats: [
        {
          number: "50+",
          label: "Beautiful Pieces",
        },
        {
          number: "100%",
          label: "Made for Homes",
        },
        {
          number: "2026",
          label: "Ghaith Home",
        },
      ],

      language: "العربية",

      mobileMenu: "Menu",
    },

    ar: {
      brand: "بيت غيث",

      nav: {
        home: "الرئيسية",
        collections: "المجموعات",
        about: "من نحن",
        contact: "تواصل معنا",
      },

      smallText: "بيت صُمّم ليشبهك",

      title: (
        <>
          كل ما
          <br />
          يحتاجه
          <br />
          <span>بيتك.</span>
        </>
      ),

      description:
        "اكتشفي قطعاً جميلة ومجموعات مختارة بعناية وكل ما تحتاجينه لتصنعي بيتاً يشبهك فعلاً.",

      shop: "تصفحي المجموعة",
      owner: "صاحب المتجر",

      stats: [
        {
          number: "+50",
          label: "قطعة مميزة",
        },
        {
          number: "100%",
          label: "لبيتك",
        },
        {
          number: "2026",
          label: "بيت غيث",
        },
      ],

      language: "English",

      mobileMenu: "القائمة",
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

  const handleNav = (section) => {
    setMenuOpen(false);

    // These are visual navigation items on the opening page.
    // Your actual customer flow still starts with /home.
    if (section === "home") {
      router.push("/home");
    }
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="ghaith-landing"
    >
      {/* =====================================================
          HERO IMAGE
      ===================================================== */}

      <div className="ghaith-hero-image">
        <div className="ghaith-image-overlay" />
        <div className="ghaith-image-overlay-bottom" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="ghaith-header">

        {/* LOGO */}

        <button
          type="button"
          className="ghaith-logo"
          onClick={() => handleNav("home")}
        >
          <span className="ghaith-logo-mark">
            G
          </span>

          <span className="ghaith-logo-text">
            {t.brand}
          </span>
        </button>

        {/* DESKTOP NAV */}

        <nav className="ghaith-nav">

          <button
            type="button"
            className="nav-link active"
            onClick={() => handleNav("home")}
          >
            {t.nav.home}
          </button>

          <button
            type="button"
            className="nav-link"
            onClick={() => handleRole("customer")}
          >
            {t.nav.collections}
          </button>

          <button
            type="button"
            className="nav-link"
          >
            {t.nav.about}
          </button>

          <button
            type="button"
            className="nav-link"
          >
            {t.nav.contact}
          </button>

        </nav>

        {/* RIGHT SIDE */}

        <div className="ghaith-header-actions">

          <button
            type="button"
            className="ghaith-language"
            onClick={() =>
              setLanguage(
                language === "en" ? "ar" : "en"
              )
            }
          >
            <Languages size={15} />

            <span>
              {t.language}
            </span>
          </button>

          <button
            type="button"
            className="ghaith-header-button"
            onClick={() => handleRole("customer")}
          >
            {t.shop}

            <ArrowUpRight size={14} />
          </button>

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="ghaith-mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t.mobileMenu}
        >
          {menuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>

      </header>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`ghaith-mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >

        <button
          type="button"
          onClick={() => handleNav("home")}
        >
          {t.nav.home}
        </button>

        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            handleRole("customer");
          }}
        >
          {t.nav.collections}
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.about}
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.contact}
        </button>

        <button
          type="button"
          onClick={() => {
            setLanguage(
              language === "en" ? "ar" : "en"
            );
            setMenuOpen(false);
          }}
        >
          {t.language}
        </button>

      </div>


      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <section className="ghaith-hero-content">

        <div className="ghaith-hero-inner">

          {/* LEFT TEXT */}

          <div className="ghaith-copy">

            <div className="ghaith-eyebrow">
              <span className="eyebrow-line" />

              <span>
                {t.smallText}
              </span>
            </div>

            <h1 className="ghaith-title">
              {t.title}
            </h1>

            <p className="ghaith-description">
              {t.description}
            </p>

            {/* ACTIONS */}

            <div className="ghaith-actions">

              <button
                type="button"
                className="ghaith-primary-button"
                onClick={() => handleRole("customer")}
              >
                <span>
                  {t.shop}
                </span>

                <span className="button-icon">
                  <ArrowRight size={17} />
                </span>
              </button>

              <button
                type="button"
                className="ghaith-secondary-button"
                onClick={() => handleRole("owner")}
              >
                <span>
                  {t.owner}
                </span>

                <ArrowUpRight size={16} />
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM STATS
      ===================================================== */}

      <div className="ghaith-bottom">

        <div className="ghaith-stats">

          {t.stats.map((stat, index) => (
            <div
              className="ghaith-stat"
              key={index}
            >
              <strong>
                {stat.number}
              </strong>

              <span>
                {stat.label}
              </span>
            </div>
          ))}

        </div>

        <div className="ghaith-scroll">
          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="scroll-line">
            <span />
          </div>
        </div>

      </div>

    </main>
  );
}