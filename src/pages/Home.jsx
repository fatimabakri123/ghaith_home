import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Home() {
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  async function fetchCategories() {
    setLoadingCategories(true);

    const { data, error } = await supabase
      .from("categories")
      .select("id, name_en, name_ar, image_url")
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error("Customer categories error:", error);
      setCategories([]);
    } else {
      console.log("Customer categories:", data);
      setCategories(data || []);
    }

    setLoadingCategories(false);
  }

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  async function fetchProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name_en,
        name_ar,
        description_en,
        description_ar,
        price,
        image_url,
        available,
        category_id,
        categories (
          id,
          name_en,
          name_ar
        )
      `)
      .eq("available", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Customer products error:", error);
      setProducts([]);
    } else {
      console.log("Customer products:", data);
      setProducts(data || []);
    }

    setLoadingProducts(false);
  }

  // ==========================================
  // CONVERT CATEGORY
  // ==========================================

  function formatCategory(category) {
    return {
      id: category.id,

      name: {
        en: category.name_en,
        ar: category.name_ar,
      },

      image: category.image_url,
      image_url: category.image_url,
    };
  }

  // ==========================================
  // SCROLL TO SECTION
  // ==========================================

  function scrollToSection(id) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <main>

      {/* ========================================
          HERO
      ======================================== */}

      <section id="home">
        <Hero />
      </section>


      {/* ========================================
          CATEGORIES
      ======================================== */}

      <section
        id="categories"
        className="categories-section"
      >

        <SectionTitle
          title={t.categories.title}
          subtitle={t.categories.subtitle}
        />

        {loadingCategories ? (

          <p className="section-message">
            {language === "en"
              ? "Loading categories..."
              : "جاري تحميل الأقسام..."}
          </p>

        ) : categories.length === 0 ? (

          <p className="section-message">
            {language === "en"
              ? "No categories available."
              : "لا توجد أقسام متاحة."}
          </p>

        ) : (

          <div className="categories-grid">

            {categories.map((category) => (

              <CategoryCard
                key={category.id}
                category={formatCategory(category)}
              />

            ))}

          </div>

        )}

      </section>


      {/* ========================================
          FEATURED PRODUCTS
      ======================================== */}

      <section
        id="products"
        className="featured-products-section"
      >

        <SectionTitle
          title={
            t.products?.title ||
            "Featured Products"
          }
          subtitle={
            t.products?.subtitle ||
            "Discover our latest products"
          }
        />

        {loadingProducts ? (

          <p className="section-message">
            {language === "en"
              ? "Loading products..."
              : "جاري تحميل المنتجات..."}
          </p>

        ) : products.length === 0 ? (

          <p className="section-message">
            {language === "en"
              ? "No products available."
              : "لا توجد منتجات متاحة."}
          </p>

        ) : (

          <div className="products-grid">

            {products
              .slice(0, 6)
              .map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

          </div>

        )}

      </section>


      {/* ========================================
          BRIDAL CHECKLIST
      ======================================== */}

      <section
        id="checklist"
        className="checklist-banner"
      >

        <div className="checklist-content">

          <span>💍</span>

          <h2>
            {t.checklist.title}
          </h2>

          <p>
            {t.checklist.subtitle}
          </p>

          <Link
            to="/checklist"
            className="checklist-button"
          >
            {t.checklist.button}
          </Link>

        </div>

      </section>


      {/* ========================================
          OPTIONAL NAVIGATION HELP
      ======================================== */}

      <div className="home-section-navigation">

        <button
          type="button"
          onClick={() => scrollToSection("categories")}
        >
          Categories
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("products")}
        >
          Products
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("checklist")}
        >
          Checklist
        </button>

      </div>

    </main>
  );
}

export default Home;