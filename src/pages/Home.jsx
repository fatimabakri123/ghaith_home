
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

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    setLoadingCategories(true);

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name_en, name_ar, image_url"
      )
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Customer categories error:",
        error
      );

      setCategories([]);
    } else {
      console.log(
        "Customer categories:",
        data
      );

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
      console.error(
        "Customer products error:",
        error
      );

      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoadingProducts(false);
  }

  // ==========================================
  // CONVERT SUPABASE CATEGORY
  // TO CATEGORYCARD FORMAT
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

  return (
    <main>

      {/* ========================================
          HERO
      ======================================== */}

      <Hero />

      {/* ========================================
          CATEGORIES
      ======================================== */}

      <section className="categories-section">

        <SectionTitle
          title={t.categories.title}
          subtitle={t.categories.subtitle}
        />

        {loadingCategories ? (

          <p>
            {language === "en"
              ? "Loading categories..."
              : "جاري تحميل الأقسام..."}
          </p>

        ) : categories.length === 0 ? (

          <p>
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

      <section className="featured-products-section">

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

          <p>
            {language === "en"
              ? "Loading products..."
              : "جاري تحميل المنتجات..."}
          </p>

        ) : products.length === 0 ? (

          <p>
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

      <section className="checklist-banner">

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

    </main>
  );
}

export default Home;

