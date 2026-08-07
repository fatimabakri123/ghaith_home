import { useParams } from "react-router-dom";
import { useState } from "react";

import { useLanguage } from "../context/LanguageContext";
import products from "../data/products";
import categories from "../data/categories";
import ProductCard from "../components/ProductCard";

function Category() {
  const { categoryId } = useParams();

  const { language } = useLanguage();

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("all");

  const category = categories.find(
    (item) => item.id === categoryId
  );

  const categoryProducts = products.filter(
    (product) => product.category === categoryId
  );

  const subcategories = [
    ...new Set(
      categoryProducts.map(
        (product) => product.subcategory
      )
    ),
  ];

  const filteredProducts =
    selectedSubcategory === "all"
      ? categoryProducts
      : categoryProducts.filter(
          (product) =>
            product.subcategory === selectedSubcategory
        );

  if (!category) {
    return (
      <div className="not-found">
        <h1>
          {language === "en"
            ? "Category Not Found"
            : "القسم غير موجود"}
        </h1>
      </div>
    );
  }

  return (
    <main className="category-page">

      {/* Header */}

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


      {/* Filters */}

      <div className="subcategory-filters">

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


        {subcategories.map((subcategory) => (

          <button
            key={subcategory}
            className={
              selectedSubcategory === subcategory
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedSubcategory(subcategory)
            }
          >

            {getSubcategoryName(
              subcategory,
              language
            )}

          </button>

        ))}

      </div>


      {/* Products */}

      {filteredProducts.length > 0 ? (

        <div className="category-products-grid">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      ) : (

        <div className="empty-category">

          <p>
            {language === "en"
              ? "No products found."
              : "لا توجد منتجات."}
          </p>

        </div>

      )}

    </main>
  );
}


/* Subcategory Translation */

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

  };

  return (
    names[subcategory]?.[language] ||
    subcategory
  );
}

export default Category;