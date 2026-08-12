
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

function Categories() {
  const { language } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("id, name_en, name_ar, image_url")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } else {
      console.log("Categories from Supabase:", data);
      setCategories(data || []);
    }

    setLoading(false);
  }

  return (
    <main>

      {/* PAGE HEADER */}
      <div className="page-header">

        <h1>
          {language === "en"
            ? "Explore Our Categories"
            : "اكتشفي أقسامنا"}
        </h1>

        <p>
          {language === "en"
            ? "Find everything you need for your new home."
            : "اكتشفي كل ما تحتاجينه لتجهيز بيتك الجديد."}
        </p>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="empty-category">
          <p>
            {language === "en"
              ? "Loading categories..."
              : "جاري تحميل الأقسام..."}
          </p>
        </div>

      ) : categories.length === 0 ? (

        <div className="empty-category">
          <p>
            {language === "en"
              ? "No categories found."
              : "لم يتم العثور على أقسام."}
          </p>
        </div>

      ) : (

        /* CATEGORIES */
        <div className="all-categories-grid">

          {categories.map((category) => (

            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="large-category-card"
            >

              <img
                src={category.image_url}
                alt={
                  language === "en"
                    ? category.name_en
                    : category.name_ar
                }
                onError={(e) => {
                  console.error(
                    "Image failed:",
                    category.image_url
                  );

                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="large-category-overlay">

                <h2>
                  {language === "en"
                    ? category.name_en
                    : category.name_ar}
                </h2>

                <span>
                  {language === "en"
                    ? "Explore"
                    : "اكتشفي القسم"}
                </span>

              </div>

            </Link>

          ))}

        </div>

      )}

    </main>
  );
}

export default Categories;

