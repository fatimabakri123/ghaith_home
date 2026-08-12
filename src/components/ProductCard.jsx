import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ProductCard({ product }) {
  const { language, t } = useLanguage();

  const name =
    language === "en"
      ? product.name_en
      : product.name_ar;

  const description =
    language === "en"
      ? product.description_en
      : product.description_ar;

  const categoryName =
    language === "en"
      ? product.categories?.name_en
      : product.categories?.name_ar;

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div className="product-image-container">

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={name}
          />
        ) : (
          <div className="no-image">
            {language === "en"
              ? "No Image"
              : "لا توجد صورة"}
          </div>
        )}

        {/* AVAILABILITY */}
        {product.available ? (
          <span className="available">
            {language === "en"
              ? "Available"
              : "متوفر"}
          </span>
        ) : (
          <span className="out-of-stock">
            {language === "en"
              ? "Out of Stock"
              : "غير متوفر"}
          </span>
        )}

      </div>

      {/* INFO */}
      <div className="product-info">

        <p className="product-category">
          {categoryName ||
            (language === "en"
              ? "Uncategorized"
              : "بدون قسم")}
        </p>

        <h3>
          {name}
        </h3>

        <p className="product-description">
          {description}
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