import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ProductCard({ product }) {
  const { language, t } = useLanguage();
  const categoryNames = {
  kitchen: {
    en: "Kitchen",
    ar: "المطبخ",
  },
  bedroom: {
    en: "Bedroom",
    ar: "غرفة النوم",
  },
  bathroom: {
    en: "Bathroom",
    ar: "الحمام",
  },
  "living-room": {
    en: "Living Room",
    ar: "غرفة الجلوس",
  },
  cleaning: {
    en: "Cleaning",
    ar: "التنظيف",
  },
  hospitality: {
    en: "Hospitality",
    ar: "الضيافة",
  },
};

  return (
    <div className="product-card">

      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name[language]}
        />

        {!product.available && (
          <span className="out-of-stock">
            {language === "en"
              ? "Out of Stock"
              : "غير متوفر"}
          </span>
        )}
      </div>

      <div className="product-info">

        <p className="product-category">
         {categoryNames[product.category][language]}
        </p>

        <h3>
          {product.name[language]}
        </h3>

        <p className="product-description">
          {product.description[language]}
        </p>

        <div className="product-bottom">

          <span className="product-price">
            ${product.price}
          </span>

          <Link
            to={`/product/${product.id}`}
            className="product-button"
          >
            {t.products.viewDetails}
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;