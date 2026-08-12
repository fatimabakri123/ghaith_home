
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function CategoryCard({ category }) {
  const { language } = useLanguage();

  return (
    <Link
      to={`/category/${category.id}`}
      className="category-card"
    >
      {/* Category Image */}
      <img
        src={category.image_url || category.image}
        alt={
          category.name?.[language] ||
          category.name_en ||
          "Category"
        }
        className="category-card-image"
        onError={(e) => {
          console.error(
            "Category image failed:",
            category.image_url
          );
        }}
      />

      {/* Overlay */}
      <div className="category-overlay">
        <h3>
          {category.name?.[language] ||
            category.name_en}
        </h3>
      </div>
    </Link>
  );
}

export default CategoryCard;

