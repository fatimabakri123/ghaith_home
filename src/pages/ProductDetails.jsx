import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PRODUCT + IMAGES
  // ==========================================

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    setError("");

    try {
      // ==========================================
      // GET PRODUCT
      // ==========================================

      const {
        data: productData,
        error: productError,
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
        .eq("id", id)
        .maybeSingle();

      if (productError) {
        throw productError;
      }

      if (!productData) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(productData);

      // ==========================================
      // GET ALL PRODUCT IMAGES
      // ==========================================

      const {
        data: productImages,
        error: imagesError,
      } = await supabase
        .from("product_images")
        .select("id, image_url")
        .eq("product_id", productData.id)
        .order("id", {
          ascending: true,
        });

      if (imagesError) {
        throw imagesError;
      }

      // ==========================================
      // CREATE IMAGE LIST
      // ==========================================

      const allImages = [];

      // Main image from products table
      if (productData.image_url) {
        allImages.push({
          id: "main",
          image_url: productData.image_url,
        });
      }

      // Additional images
      if (productImages) {
        productImages.forEach((image) => {
          // Prevent duplicate main image
          if (
            image.image_url !==
            productData.image_url
          ) {
            allImages.push(image);
          }
        });
      }

      setImages(allImages);
      setCurrentImage(0);

    } catch (err) {
      console.error(
        "Product details error:",
        err
      );

      setError(
        err.message ||
        "Could not load product."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // NEXT IMAGE
  // ==========================================

  function nextImage() {
    if (images.length <= 1) return;

    setCurrentImage((previous) =>
      previous === images.length - 1
        ? 0
        : previous + 1
    );
  }

  // ==========================================
  // PREVIOUS IMAGE
  // ==========================================

  function previousImage() {
    if (images.length <= 1) return;

    setCurrentImage((previous) =>
      previous === 0
        ? images.length - 1
        : previous - 1
    );
  }

  // ==========================================
  // KEYBOARD NAVIGATION
  // ==========================================

  useEffect(() => {
    function handleKeyboard(e) {
      if (e.key === "ArrowRight") {
        nextImage();
      }

      if (e.key === "ArrowLeft") {
        previousImage();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [images.length]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main>
        <div className="empty-category">
          <p>
            {language === "en"
              ? "Loading product..."
              : "جاري تحميل المنتج..."}
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main>
        <div className="empty-category">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <main>
        <div className="empty-category">
          <p>
            {language === "en"
              ? "Product Not Found"
              : "المنتج غير موجود"}
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // TEXT
  // ==========================================

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

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="product-details-page">

      {/* ========================================
          BACK
      ======================================== */}

      <div className="product-details-back">

        <Link
          to={`/category/${product.category_id}`}
        >
          ←{" "}
          {language === "en"
            ? "Back to Category"
            : "العودة إلى القسم"}
        </Link>

      </div>

      {/* ========================================
          PRODUCT
      ======================================== */}

      <div className="product-details-container">

        {/* ======================================
            IMAGE GALLERY
        ====================================== */}

        <div className="product-gallery">

          {/* MAIN IMAGE */}

          <div className="product-main-image">

            {images.length > 0 ? (

              <img
                src={
                  images[currentImage]
                    ?.image_url
                }
                alt={name}
              />

            ) : (

              <div className="no-product-image">
                {language === "en"
                  ? "No Image"
                  : "لا توجد صورة"}
              </div>

            )}

            {/* LEFT BUTTON */}

            {images.length > 1 && (

              <button
                type="button"
                className="gallery-arrow gallery-arrow-left"
                onClick={previousImage}
                aria-label="Previous image"
              >
                ‹
              </button>

            )}

            {/* RIGHT BUTTON */}

            {images.length > 1 && (

              <button
                type="button"
                className="gallery-arrow gallery-arrow-right"
                onClick={nextImage}
                aria-label="Next image"
              >
                ›
              </button>

            )}

            {/* IMAGE COUNTER */}

            {images.length > 1 && (

              <div className="image-counter">
                {currentImage + 1} /{" "}
                {images.length}
              </div>

            )}

            {/* AVAILABILITY */}

            {product.available ? (

              <span className="available product-availability">

                {language === "en"
                  ? "Available"
                  : "متوفر"}

              </span>

            ) : (

              <span className="out-of-stock product-availability">

                {language === "en"
                  ? "Out of Stock"
                  : "غير متوفر"}

              </span>

            )}

          </div>

          {/* ====================================
              THUMBNAILS
          ==================================== */}

          {images.length > 1 && (

            <div className="product-thumbnails">

              {images.map(
                (image, index) => (

                  <button
                    type="button"
                    key={image.id}
                    className={
                      `product-thumbnail ${
                        currentImage === index
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={() =>
                      setCurrentImage(index)
                    }
                  >

                    <img
                      src={
                        image.image_url
                      }
                      alt={`${name} ${
                        index + 1
                      }`}
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* ======================================
            PRODUCT INFORMATION
        ====================================== */}

        <div className="product-details-info">

          {/* CATEGORY */}

          <p className="product-details-category">
            {categoryName ||
              (language === "en"
                ? "Uncategorized"
                : "بدون قسم")}
          </p>

          {/* NAME */}

          <h1>
            {name}
          </h1>

          {/* PRICE */}

          <div className="product-details-price">
            ${product.price}
          </div>

          {/* DESCRIPTION */}

          {description && (

            <p className="product-details-description">
              {description}
            </p>

          )}

          {/* AVAILABILITY */}

          <div className="product-details-stock">

            {product.available ? (

              <span className="stock-available">

                ✓{" "}
                {language === "en"
                  ? "Available"
                  : "متوفر"}

              </span>

            ) : (

              <span className="stock-unavailable">

                ✕{" "}
                {language === "en"
                  ? "Out of Stock"
                  : "غير متوفر"}

              </span>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;