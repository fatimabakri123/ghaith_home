import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function CategoryCard({ category }) {
  const { language } = useLanguage();

  return (
    <Link
      to={`/category/${category.id}`}
      className="category-card"
    >
      <img
        src={category.image}
        alt={category.name[language]}
      />

      <div className="category-overlay">
        <h3>{category.name[language]}</h3>
      </div>
    </Link>
  );
}

export default CategoryCard;