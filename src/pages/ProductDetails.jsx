import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";
import { supabase } from "../lib/supabase";

function ProductDetails() {
  const { addToList } = useBridalList();
  const { id } = useParams();
  const { language } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

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
        categories (
          id,
          name_en,
          name_ar
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Product details error:", error);
      setProduct(null);
    } else {
      setProduct(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-container">
          <p>
            {language === "en"
              ? "Loading product..."
              : "جاري تحميل المنتج..."}
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-details-container">
          <h2>
            {language === "en"
              ? "Product Not Found"
              : "المنتج غير موجود"}
          </h2>
        </div>
      </main>
    );
  }

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
    <main className="product-details-page">

      <div className="product-details-container">

        {/* Image */}
        <div className="product-details-image">

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

        </div>

        {/* Info */}
        <div className="product-details-info">

          <h1>
            {name}
          </h1>

          <p className="details-price">
            ${product.price}
          </p>

          <p className="details-description">
            {description}
          </p>

          <div className="product-info-box">

            <p>
              <strong>
                {language === "en"
                  ? "Category:"
                  : "القسم:"}
              </strong>

              {" "}

              {categoryName || "-"}
            </p>

            <p>
              <strong>
                {language === "en"
                  ? "Availability:"
                  : "التوفر:"}
              </strong>

              {" "}

              {product.available
                ? language === "en"
                  ? "Available"
                  : "متوفر"
                : language === "en"
                ? "Out of Stock"
                : "غير متوفر"}
            </p>

          </div>

          <button
            className="add-list-button"
            onClick={() => addToList(product)}
            disabled={!product.available}
          >
            💍{" "}
            {language === "en"
              ? "Add to Bridal List"
              : "أضيفي إلى قائمة العروس"}
          </button>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;