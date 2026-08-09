
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    price: "",
    category_id: "",
    subcategory: "",
    available: true,
  });

  const [image, setImage] = useState(null);

  // ==========================================
  // SUBCATEGORY OPTIONS
  // ==========================================

  const subcategoryOptions = {
    kitchen: [
      {
        value: "cookware",
        en: "Cookware",
        ar: "الطناجر والمقالي",
      },
      {
        value: "dinnerware",
        en: "Dinnerware",
        ar: "أطقم السفرة",
      },
      {
        value: "storage",
        en: "Storage",
        ar: "التخزين والتنظيم",
      },
      {
        value: "coffee",
        en: "Coffee",
        ar: "القهوة",
      },
    ],

    bedroom: [
      {
        value: "bed-linen",
        en: "Bed Linen",
        ar: "أغطية السرير",
      },
      {
        value: "storage",
        en: "Storage",
        ar: "التخزين والتنظيم",
      },
    ],

    bathroom: [
      {
        value: "towels",
        en: "Towels",
        ar: "المناشف",
      },
      {
        value: "storage",
        en: "Storage",
        ar: "التخزين والتنظيم",
      },
    ],

    "living-room": [
      {
        value: "furniture",
        en: "Furniture",
        ar: "الأثاث",
      },
      {
        value: "decor",
        en: "Decor",
        ar: "الديكور",
      },
    ],

    cleaning: [
      {
        value: "cleaning-tools",
        en: "Cleaning Tools",
        ar: "أدوات التنظيف",
      },
    ],

    hospitality: [
      {
        value: "serving",
        en: "Serving",
        ar: "التقديم",
      },
      {
        value: "coffee",
        en: "Coffee",
        ar: "القهوة",
      },
    ],
  };

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoadingCategories(true);

    const { data, error } = await supabase
      .from("categories")
      .select("id, name_en, name_ar")
      .order("name_en");

    if (error) {
      console.error(
        "Categories error:",
        error
      );

      setError(
        "Could not load categories."
      );
    } else {
      setCategories(data || []);
    }

    setLoadingCategories(false);
  }

  // ==========================================
  // NORMAL INPUT CHANGE
  // ==========================================

  function handleChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  function handleCategoryChange(e) {
    const categoryId = e.target.value;

    setForm((previous) => ({
      ...previous,
      category_id: categoryId,
      subcategory: "",
    }));

    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    const selectedCategory =
      categories.find(
        (category) =>
          String(category.id) ===
          String(categoryId)
      );

    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }

    /*
      Convert category name into the same
      format used in subcategoryOptions.

      Example:

      Kitchen
      ↓
      kitchen

      Living Room
      ↓
      living-room
    */

    const categoryKey =
      selectedCategory.name_en
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    setSubcategories(
      subcategoryOptions[categoryKey] || []
    );
  }

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  function handleImageChange(e) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setImage(file);
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // -----------------------------
    // Validate image
    // -----------------------------

    if (!image) {
      setError(
        "Please choose a product image."
      );

      setLoading(false);
      return;
    }

    // -----------------------------
    // Validate category
    // -----------------------------

    if (!form.category_id) {
      setError(
        "Please select a category."
      );

      setLoading(false);
      return;
    }

    // -----------------------------
    // Validate subcategory
    // -----------------------------

    if (!form.subcategory) {
      setError(
        "Please select a subcategory."
      );

      setLoading(false);
      return;
    }

    try {
      // ==========================================
      // 1. UPLOAD IMAGE
      // ==========================================

      const fileExtension =
        image.name
          .split(".")
          .pop()
          ?.toLowerCase();

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

      const filePath =
        `products/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          image,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      // ==========================================
      // 2. GET PUBLIC IMAGE URL
      // ==========================================

      const {
        data: imageData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl =
        imageData?.publicUrl;

      if (!imageUrl) {
        throw new Error(
          "Could not create image URL."
        );
      }

      // ==========================================
      // 3. INSERT PRODUCT
      // ==========================================

      const {
        error: productError,
      } = await supabase
        .from("products")
        .insert({
          name_en:
            form.name_en,

          name_ar:
            form.name_ar,

          description_en:
            form.description_en,

          description_ar:
            form.description_ar,

          price:
            Number(form.price),

          category_id:
            Number(form.category_id),

          subcategory:
            form.subcategory,

          image_url:
            imageUrl,

          available:
            form.available,
        });

      if (productError) {
        throw productError;
      }

      // ==========================================
      // 4. SUCCESS
      // ==========================================

      navigate(
        "/admin/products"
      );

    } catch (err) {
      console.error(
        "Add product error:",
        err
      );

      setError(
        err.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main>

      <div className="add-product-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="add-product-header">

          <div>

            <p>
              Bridal Home
            </p>

            <h1>
              Add Product
            </h1>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            ← Back
          </button>

        </div>


        {/* ========================================
            FORM
        ======================================== */}

        <form
          className="product-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* ======================================
              IMAGE
          ====================================== */}

          <section className="form-section">

            <h2>
              Product Image
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              required
            />

            {image && (
              <p>
                Selected:{" "}
                {image.name}
              </p>
            )}

          </section>


          {/* ======================================
              PRODUCT INFORMATION
          ====================================== */}

          <section className="form-section">

            <h2>
              Product Information
            </h2>


            {/* English Name */}

            <label>
              English Name
            </label>

            <input
              type="text"
              name="name_en"
              value={
                form.name_en
              }
              onChange={
                handleChange
              }
              placeholder="Example: 12 Piece Cookware Set"
              required
            />


            {/* Arabic Name */}

            <label>
              Arabic Name
            </label>

            <input
              type="text"
              name="name_ar"
              value={
                form.name_ar
              }
              onChange={
                handleChange
              }
              placeholder="مثال: طقم طناجر 12 قطعة"
              dir="rtl"
              required
            />

          </section>


          {/* ======================================
              DESCRIPTION
          ====================================== */}

          <section className="form-section">

            <h2>
              Description
            </h2>


            {/* English Description */}

            <label>
              English Description
            </label>

            <textarea
              name="description_en"
              value={
                form.description_en
              }
              onChange={
                handleChange
              }
              placeholder="Describe the product..."
              rows="5"
            />


            {/* Arabic Description */}

            <label>
              Arabic Description
            </label>

            <textarea
              name="description_ar"
              value={
                form.description_ar
              }
              onChange={
                handleChange
              }
              placeholder="اكتبي تفاصيل المنتج..."
              dir="rtl"
              rows="5"
            />

          </section>


          {/* ======================================
              PRICE + CATEGORY
          ====================================== */}

          <section className="form-section">

            <h2>
              Pricing & Category
            </h2>


            {/* Price */}

            <label>
              Price
            </label>

            <input
              type="number"
              name="price"
              value={
                form.price
              }
              onChange={
                handleChange
              }
              placeholder="120"
              min="0"
              step="0.01"
              required
            />


            {/* Category */}

            <label>
              Category
            </label>

            {loadingCategories ? (

              <p>
                Loading categories...
              </p>

            ) : (

              <select
                name="category_id"
                value={
                  form.category_id
                }
                onChange={
                  handleCategoryChange
                }
                required
              >

                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name_en
                      }

                      {" — "}

                      {
                        category.name_ar
                      }
                    </option>

                  )
                )}

              </select>

            )}


            {/* ==================================
                SUBCATEGORY
            ================================== */}

            <label>
              Subcategory
            </label>

            <select
              name="subcategory"
              value={
                form.subcategory
              }
              onChange={
                handleChange
              }
              disabled={
                !form.category_id ||
                subcategories.length === 0
              }
              required
            >

              <option value="">
                {!form.category_id
                  ? "Select category first"
                  : subcategories.length === 0
                  ? "No subcategories"
                  : "Select subcategory"}
              </option>

              {subcategories.map(
                (subcategory) => (

                  <option
                    key={
                      subcategory.value
                    }
                    value={
                      subcategory.value
                    }
                  >
                    {
                      subcategory.en
                    }

                    {" — "}

                    {
                      subcategory.ar
                    }
                  </option>

                )
              )}

            </select>

          </section>


          {/* ======================================
              AVAILABILITY
          ====================================== */}

          <section className="form-section">

            <label className="checkbox-label">

              <input
                type="checkbox"
                name="available"
                checked={
                  form.available
                }
                onChange={
                  handleChange
                }
              />

              Product is available

            </label>

          </section>


          {/* ======================================
              ERROR
          ====================================== */}

          {error && (

            <div className="admin-error">
              {error}
            </div>

          )}


          {/* ======================================
              SAVE
          ====================================== */}

          <button
            className="save-product-button"
            type="submit"
            disabled={
              loading
            }
          >

            {loading
              ? "Saving Product..."
              : "Save Product"}

          </button>

        </form>

      </div>

    </main>
  );
}

export default AddProduct;

