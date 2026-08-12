import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

function Category() {
  const { categoryId } = useParams();
  const { language } = useLanguage();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("all");

  // ==========================================
  // SUBCATEGORIES
  // ==========================================

  const categorySubcategories = {
    Kitchen: [
      "cookware",
      "dinnerware",
      "storage",
      "coffee",
      "serving",
    ],

    Bedroom: [
      "bed-linen",
      "storage",
      "decor",
    ],

    Bathroom: [
      "towels",
      "storage",
      "decor",
    ],

    "Living Room": [
      "furniture",
      "decor",
      "storage",
    ],

    Cleaning: [
      "cleaning-tools",
      "storage",
    ],

    Hospitality: [
      "serving",
      "coffee",
      "dinnerware",
      "storage",
    ],
  };

  // ==========================================
  // FETCH CATEGORY + PRODUCTS
  // ==========================================

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  async function fetchCategoryAndProducts() {
    setLoading(true);

    console.log("URL category ID:", categoryId);

    // ==========================================
    // GET CATEGORY DIRECTLY BY SUPABASE ID
    // ==========================================

    const {
      data: categoryData,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id, name_en, name_ar, image_url")
      .eq("id", categoryId)
      .maybeSingle();

    if (categoryError) {
      console.error(
        "Category error:",
        categoryError
      );

      setCategory(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    if (!categoryData) {
      console.error(
        "No category found with ID:",
        categoryId
      );

      setCategory(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    console.log(
      "Supabase category:",
      categoryData
    );

    setCategory(categoryData);

    // ==========================================
    // GET PRODUCTS FOR THIS CATEGORY
    // ==========================================
const {
  data: productsData,
  error: productsError,
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
    created_at
  `)
  .eq("category_id", categoryData.id)
  .order("created_at", {
    ascending: false,
  });

    if (productsError) {
      console.error(
        "Category products error:",
        productsError
      );

      setProducts([]);
    } else {
      console.log(
        "Products for category:",
        productsData
      );

      setProducts(productsData || []);
    }

    setLoading(false);
  }

  // ==========================================
  // GET SUBCATEGORIES
  // ==========================================

  const subcategories =
    categorySubcategories[category?.name_en] || [];

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

  if (!loading && !category) {
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
          {loading
            ? language === "en"
              ? "Loading..."
              : "جاري التحميل..."
            : language === "en"
              ? category?.name_en
              : category?.name_ar}
        </h1>

        {!loading && (
          <p>
            {language === "en"
              ? "Discover our collection."
              : "اكتشفي مجموعتنا من المنتجات."}
          </p>
        )}

      </div>

      {/* ========================================
          SUBCATEGORY FILTERS
      ======================================== */}

      {!loading && category && (
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
      )}

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