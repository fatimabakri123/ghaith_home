
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");

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
        category_id,
        subcategory,
        categories (
          id,
          name_en,
          name_ar
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Products error:",
        error
      );

      setError(
        "Could not load products."
      );

      setLoading(false);
      return;
    }

    setProducts(data || []);

    setLoading(false);
  }

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  function handleEdit(product) {
    setEditingProduct({
      id: product.id,
      name_en: product.name_en || "",
      name_ar: product.name_ar || "",
      description_en:
        product.description_en || "",
      description_ar:
        product.description_ar || "",
      price: product.price || "",
      image_url:
        product.image_url || "",
      available:
        product.available ?? true,
      category_id:
        product.category_id || "",
      subcategory:
        product.subcategory || "",
    });

    setShowEditModal(true);
  }

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  function closeEditModal() {
    if (saving) return;

    setShowEditModal(false);
    setEditingProduct(null);
  }

  // ==========================================
  // HANDLE EDIT INPUT
  // ==========================================

  function handleEditChange(e) {
    const { name, value, type, checked } =
      e.target;

    setEditingProduct((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // ==========================================
  // SAVE EDIT
  // ==========================================

async function handleSaveEdit(e) {
  e.preventDefault();

  if (!editingProduct) return;

  setSaving(true);
  setError("");

  try {
    const {
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
    } = editingProduct;

    console.log("UPDATING PRODUCT:", id);

    // ========================================
    // UPDATE PRODUCT IN SUPABASE
    // ========================================

    const { error } = await supabase
      .from("products")
      .update({
        name_en: name_en,
        name_ar: name_ar,
        description_en: description_en,
        description_ar: description_ar,
        price: Number(price),
        image_url: image_url,
        available: available,
        category_id: category_id,
        subcategory: subcategory,
      })
      .eq("id", id);

    // ========================================
    // CHECK UPDATE ERROR
    // ========================================

    if (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      console.error(
        "ERROR CODE:",
        error.code
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      console.error(
        "ERROR DETAILS:",
        error.details
      );

      console.error(
        "ERROR HINT:",
        error.hint
      );

      setError(error.message);

      alert(
        `Could not update product.\n\n${error.message}`
      );

      setSaving(false);
      return;
    }

    // ========================================
    // UPDATE SUCCESSFUL
    // ========================================

    console.log(
      "PRODUCT UPDATED SUCCESSFULLY:",
      id
    );

    // Get the updated products again
    await fetchProducts();

    // Close modal
    setShowEditModal(false);
    setEditingProduct(null);

    alert(
      "Product updated successfully!"
    );

  } catch (error) {
    console.error(
      "UNEXPECTED UPDATE ERROR:",
      error
    );

    alert(
      `Something went wrong.\n\n${error.message}`
    );
  }

  setSaving(false);
}

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name_en}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      console.log(
        "Deleting product:",
        product.id
      );

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) {
        console.error(
          "Delete product error:",
          error
        );

        setError(error.message);

        alert(
          `Could not delete product:\n\n${error.message}`
        );

        return;
      }

      // ========================================
      // REMOVE PRODUCT FROM SCREEN
      // ========================================

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) =>
            item.id !== product.id
        )
      );

      alert(
        "Product deleted successfully!"
      );

    } catch (error) {
      console.error(
        "Unexpected delete error:",
        error
      );

      alert(
        "Something went wrong while deleting."
      );
    }
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="admin-products-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-products-header">

        <div>
          <p>Bridal Home</p>

          <h1>Products</h1>
        </div>

        <button
          onClick={() =>
            window.location.href =
              "/admin/products/add"
          }
        >
          + Add Product
        </button>

      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      {/* ========================================
          LOADING
      ======================================== */}

      {loading && (
        <p>
          Loading products...
        </p>
      )}

      {/* ========================================
          EMPTY
      ======================================== */}

      {!loading &&
        products.length === 0 && (

          <div className="empty-products">

            <h2>
              No products yet
            </h2>

            <p>
              Start adding products
              to your store.
            </p>

            <button
              onClick={() =>
                window.location.href =
                  "/admin/products/add"
              }
            >
              Add Your First Product
            </button>

          </div>
        )}

      {/* ========================================
          PRODUCTS GRID
      ======================================== */}

      {!loading &&
        products.length > 0 && (

          <div className="products-grid">

            {products.map((product) => (

              <div
                className="admin-product-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div className="product-image">

                  {product.image_url ? (

                    <img
                      src={product.image_url}
                      alt={product.name_en}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                  ) : (

                    <div className="no-image">
                      No Image
                    </div>

                  )}

                </div>

                {/* INFO */}

                <div className="product-info">

                  <h2>
                    {product.name_en}
                  </h2>

                  <p className="arabic-name">
                    {product.name_ar}
                  </p>

                  <p className="product-category">

                    {product.categories
                      ?.name_en ||
                      "No category"}

                  </p>

                  {product.subcategory && (

                    <p className="product-subcategory">
                      {product.subcategory}
                    </p>

                  )}

                  <strong>
                    ${product.price}
                  </strong>

                  <p>
                    {product.available
                      ? "✓ Available"
                      : "× Not Available"}
                  </p>

                  {/* ACTIONS */}

                  <div className="product-actions">

                    <button
                      className="edit-product-btn"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-product-btn"
                      onClick={() =>
                        handleDelete(product)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEditModal &&
        editingProduct && (

          <div
            className="edit-modal-overlay"
            onClick={closeEditModal}
          >

            <div
              className="edit-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="edit-modal-header">

                <div>
                  <p>Edit Product</p>

                  <h2>
                    {editingProduct.name_en ||
                      "Product"}
                  </h2>
                </div>

                <button
                  className="close-modal-btn"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSaveEdit}
                className="edit-product-form"
              >

                {/* ENGLISH NAME */}

                <div className="form-group">

                  <label>
                    Product Name
                    (English)
                  </label>

                  <input
                    type="text"
                    name="name_en"
                    value={
                      editingProduct.name_en
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                  />

                </div>

                {/* ARABIC NAME */}

                <div className="form-group">

                  <label>
                    Product Name
                    (Arabic)
                  </label>

                  <input
                    type="text"
                    name="name_ar"
                    value={
                      editingProduct.name_ar
                    }
                    onChange={
                      handleEditChange
                    }
                    dir="rtl"
                    required
                  />

                </div>

                {/* ENGLISH DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Description
                    (English)
                  </label>

                  <textarea
                    name="description_en"
                    value={
                      editingProduct
                        .description_en
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="3"
                  />

                </div>

                {/* ARABIC DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Description
                    (Arabic)
                  </label>

                  <textarea
                    name="description_ar"
                    value={
                      editingProduct
                        .description_ar
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="3"
                    dir="rtl"
                  />

                </div>

                {/* PRICE */}

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      editingProduct.price
                    }
                    onChange={
                      handleEditChange
                    }
                    min="0"
                    step="0.01"
                    required
                  />

                </div>

                {/* IMAGE URL */}

                <div className="form-group">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image_url"
                    value={
                      editingProduct
                        .image_url
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="https://..."
                  />

                </div>

                {/* SUBCATEGORY */}

                <div className="form-group">

                  <label>
                    Subcategory
                  </label>

                  <input
                    type="text"
                    name="subcategory"
                    value={
                      editingProduct
                        .subcategory
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="cookware"
                  />

                </div>

                {/* AVAILABLE */}

                <div className="available-checkbox">

                  <label>

                    <input
                      type="checkbox"
                      name="available"
                      checked={
                        editingProduct
                          .available
                      }
                      onChange={
                        handleEditChange
                      }
                    />

                    <span>
                      Product is
                      available
                    </span>

                  </label>

                </div>

                {/* BUTTONS */}

                <div className="edit-modal-actions">

                  <button
                    type="button"
                    className="cancel-edit-btn"
                    onClick={
                      closeEditModal
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-edit-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

    </main>
  );
}

export default AdminProducts;

