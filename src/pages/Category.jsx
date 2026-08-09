
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import categories from "../data/categories";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

function Category() {
  const { categoryId } = useParams();
  const { language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("all");

  const category = categories.find(
    (item) => item.id === categoryId
  );

  // ==========================================
  // SUBCATEGORIES FOR EACH MAIN CATEGORY
  // ==========================================

  const categorySubcategories = {
    kitchen: [
      "cookware",
      "dinnerware",
      "storage",
      "coffee",
      "serving",
    ],

    bedroom: [
      "bed-linen",
      "storage",
      "decor",
    ],

    bathroom: [
      "towels",
      "storage",
      "decor",
    ],

    "living-room": [
      "furniture",
      "decor",
      "storage",
    ],

    cleaning: [
      "cleaning-tools",
      "storage",
    ],

    hospitality: [
      "serving",
      "coffee",
      "dinnerware",
      "storage",
    ],
  };

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [categoryId]);

  async function fetchProducts() {
    setLoading(true);

    // ------------------------------------------
    // Find matching Supabase category
    // ------------------------------------------

    const {
      data: supabaseCategory,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id, name_en, name_ar")
      .or(
        `name_en.ilike.${category.name.en},name_ar.ilike.${category.name.ar}`
      )
      .maybeSingle();

    if (categoryError) {
      console.error(
        "Category error:",
        categoryError
      );

      setProducts([]);
      setLoading(false);
      return;
    }

    if (!supabaseCategory) {
      console.error(
        "No matching category found in Supabase."
      );

      setProducts([]);
      setLoading(false);
      return;
    }

    // ------------------------------------------
    // Fetch products
    // ------------------------------------------

    const {
      data,
      error,
    } = await supabase
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
        subcategory,
        categories (
          id,
          name_en,
          name_ar
        )
      `)
      .eq(
        "category_id",
        supabaseCategory.id
      )
      .eq("available", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Category products error:",
        error
      );

      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  // ==========================================
  // GET CATEGORY SUBCATEGORIES
  // ==========================================

  const subcategories =
    categorySubcategories[categoryId] || [];

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts =
    selectedSubcategory === "all"
      ? products
      : products.filter(
          (product) =>
            product.subcategory ===
            selectedSubcategory
        );

  // ==========================================
  // CATEGORY NOT FOUND
  // ==========================================

  if (!category) {
    return (
      <main>
        <div className="empty-category">
          <p>
            {language === "en"
              ? "Category Not Found"
              : "القسم غير موجود"}
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main>

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="category-page-header">

        <h1>
          {category.name[language]}
        </h1>

        <p>
          {language === "en"
            ? "Discover our collection."
            : "اكتشفي مجموعتنا من المنتجات."}
        </p>

      </div>

      {/* ========================================
          SUBCATEGORY FILTERS
      ======================================== */}

      <div className="subcategory-filters">

        {/* ALL */}

        <button
          className={
            selectedSubcategory === "all"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedSubcategory("all")
          }
        >
          {language === "en"
            ? "All"
            : "الكل"}
        </button>

        {/* SUBCATEGORIES */}

        {subcategories.map(
          (subcategory) => (
            <button
              key={subcategory}
              className={
                selectedSubcategory ===
                subcategory
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedSubcategory(
                  subcategory
                )
              }
            >
              {getSubcategoryName(
                subcategory,
                language
              )}
            </button>
          )
        )}

      </div>

      {/* ========================================
          LOADING
      ======================================== */}

      {loading ? (

        <div className="empty-category">

          <p>
            {language === "en"
              ? "Loading products..."
              : "جاري تحميل المنتجات..."}
          </p>

        </div>

      ) : filteredProducts.length > 0 ? (

        /* ======================================
           PRODUCTS
        ====================================== */

        <div className="category-products-grid">

          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}

        </div>

      ) : (

        /* ======================================
           EMPTY
        ====================================== */

        <div className="empty-category">

          <p>
            {language === "en"
              ? "No products found."
              : "لا توجد منتجات في هذا القسم."}
          </p>

        </div>

      )}

    </main>
  );
}

// ============================================
// SUBCATEGORY TRANSLATION
// ============================================

function getSubcategoryName(
  subcategory,
  language
) {
  const names = {

    cookware: {
      en: "Cookware",
      ar: "الطناجر والمقالي",
    },

    dinnerware: {
      en: "Dinnerware",
      ar: "أطقم السفرة",
    },

    storage: {
      en: "Storage",
      ar: "التخزين والتنظيم",
    },

    coffee: {
      en: "Coffee",
      ar: "القهوة",
    },

    towels: {
      en: "Towels",
      ar: "المناشف",
    },

    "bed-linen": {
      en: "Bed Linen",
      ar: "أغطية السرير",
    },

    furniture: {
      en: "Furniture",
      ar: "الأثاث",
    },

    decor: {
      en: "Decor",
      ar: "الديكور",
    },

    "cleaning-tools": {
      en: "Cleaning Tools",
      ar: "أدوات التنظيف",
    },

    serving: {
      en: "Serving",
      ar: "التقديم",
    },

  };

  return (
    names[subcategory]?.[language] ||
    subcategory
  );
}

export default Category;

