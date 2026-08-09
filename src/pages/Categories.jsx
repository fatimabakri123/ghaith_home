import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import categories from "../data/categories";

function Categories() {
  const { language } = useLanguage();

  return (
    <main>

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

      <div className="all-categories-grid">

        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="large-category-card"
          >

            <img
              src={category.image}
              alt={category.name[language]}
            />

            <div className="large-category-overlay">

              <h2>
                {category.name[language]}
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

    </main>
  );
}

export default Categories;