import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminCategories() {
    const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // FETCH CATEGORIES
  // =========================
  async function fetchCategories() {
    setFetching(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("FETCH CATEGORIES ERROR:", error);
      setMessage(error.message);
    } else {
      setCategories(data || []);
    }

    setFetching(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // RESET FORM
  // =========================
  function resetForm() {
    setNameEn("");
    setNameAr("");
    setImageFile(null);
    setEditingId(null);
    setOldImageUrl("");
    setMessage("");

    const fileInput = document.getElementById("category-image");

    if (fileInput) {
      fileInput.value = "";
    }
  }

  // =========================
  // UPLOAD IMAGE
  // =========================
  async function uploadImage() {
    if (!imageFile) {
      return oldImageUrl || "";
    }

    const fileExt = imageFile.name.split(".").pop();

    const fileName = `category-${Date.now()}.${fileExt}`;

    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("IMAGE UPLOAD ERROR:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // =========================
  // ADD / UPDATE CATEGORY
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();
       const {
  data: { session },
} = await supabase.auth.getSession();

console.log("ADMIN SESSION:", session);
console.log("USER:", session?.user);
    setMessage("");

    if (!nameEn.trim() || !nameAr.trim()) {
      setMessage("Please enter the category name in both languages.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      // =========================
      // UPDATE
      // =========================
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update({
            name_en: nameEn.trim(),
            name_ar: nameAr.trim(),
            image_url: imageUrl,
          })
          .eq("id", editingId);

        if (error) {
          throw error;
        }

        setMessage("Category updated successfully.");
      }

      // =========================
      // ADD
      // =========================
      else {
        const { error } = await supabase
          .from("categories")
          .insert([
            {
              name_en: nameEn.trim(),
              name_ar: nameAr.trim(),
              image_url: imageUrl,
            },
          ]);

        if (error) {
          throw error;
        }

        setMessage("Category added successfully.");
      }

      resetForm();
      await fetchCategories();
    } catch (error) {
      console.error("CATEGORY ERROR:", error);
      setMessage(error.message || "Something went wrong.");
    }

    setLoading(false);
  }

  // =========================
  // EDIT
  // =========================
  function handleEdit(category) {
    setEditingId(category.id);

    setNameEn(category.name_en || "");
    setNameAr(category.name_ar || "");

    setOldImageUrl(category.image_url || "");
    setImageFile(null);

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // DELETE
  // =========================
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE CATEGORY ERROR:", error);
      setMessage(error.message);
    } else {
      setMessage("Category deleted successfully.");
      await fetchCategories();
    }

    setLoading(false);
  }

  return (
    <main className="admin-categories">

      {/* =========================
          HEADER
      ========================= */}
    <div className="admin-categories-header">

  <div>
    <p>Bridal Home</p>
    <h1>Categories</h1>
  </div>

  <button
    className="back-button"
    onClick={() => navigate("/admin")}
  >
    ← Back to Dashboard
  </button>

</div>

      {/* =========================
          FORM
      ========================= */}
      <section className="category-form-card">

        <h2>
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Category Name (English)</label>

            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Example: Kitchen"
            />
          </div>


          <div className="form-group">
            <label>Category Name (Arabic)</label>

            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: المطبخ"
              dir="rtl"
            />
          </div>


          <div className="form-group">
            <label>Category Image</label>

            <input
              id="category-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.target.files?.[0] || null);
              }}
            />
          </div>


          {/* CURRENT IMAGE */}
          {editingId && oldImageUrl && !imageFile && (
            <div className="current-image">
              <p>Current Image</p>

              <img
                src={oldImageUrl}
                alt={nameEn}
              />
            </div>
          )}


          {/* NEW IMAGE PREVIEW */}
          {imageFile && (
            <div className="current-image">
              <p>New Image</p>

              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
              />
            </div>
          )}


          <div className="form-buttons">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>


            {editingId && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

        {message && (
          <p className="category-message">
            {message}
          </p>
        )}

      </section>


      {/* =========================
          CATEGORY LIST
      ========================= */}
      <section className="categories-list">

        <div className="categories-list-header">
          <h2>All Categories</h2>

          <span>
            {categories.length} categories
          </span>
        </div>


        {fetching ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (

          <div className="categories-grid">

            {categories.map((category) => (

              <div
                className="category-admin-card"
                key={category.id}
              >

                <div className="category-admin-image">

                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name_en}
                    />
                  ) : (
                    <div className="no-image">
                      No Image
                    </div>
                  )}

                </div>


                <div className="category-admin-info">

                  <h3>
                    {category.name_en}
                  </h3>

                  <p dir="rtl">
                    {category.name_ar}
                  </p>

                </div>


                <div className="category-admin-actions">

                  <button
                    onClick={() => handleEdit(category)}
                  >
                    ✏️ Edit
                  </button>


                  <button
                    onClick={() => handleDelete(category.id)}
                    className="delete-button"
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminCategories;