import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // CURRENT IMAGE FOR EACH PRODUCT
  // ==========================================

  const [currentImages, setCurrentImages] = useState({});

  // ==========================================
  // EDIT IMAGE FILES
  // ==========================================

  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");

    try {
      // ========================================
      // GET PRODUCTS
      // ========================================

      const {
        data: productsData,
        error: productsError,
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
          created_at,
          categories (
            id,
            name_en,
            name_ar
          )
        `)
        .order("created_at", {
          ascending: false,
        });

      if (productsError) {
        console.error(
          "Products error:",
          productsError
        );

        setError("Could not load products.");
        setLoading(false);
        return;
      }

      // ========================================
      // GET ALL ADDITIONAL IMAGES
      // ========================================

      const {
        data: additionalImages,
        error: imagesError,
      } = await supabase
        .from("product_images")
        .select(`
          id,
          product_id,
          image_url
        `)
        .order("id", {
          ascending: true,
        });

      if (imagesError) {
        console.error(
          "Product images error:",
          imagesError
        );
      }

      // ========================================
      // COMBINE MAIN + ADDITIONAL IMAGES
      // ========================================

      const productsWithImages =
        (productsData || []).map((product) => {
          const images = [];

          // MAIN IMAGE
          if (product.image_url) {
            images.push({
              id: `main-${product.id}`,
              image_url: product.image_url,
              isMain: true,
            });
          }

          // ADDITIONAL IMAGES
          const productAdditionalImages =
            (additionalImages || []).filter(
              (image) =>
                String(image.product_id) ===
                String(product.id)
            );

          productAdditionalImages.forEach(
            (image) => {
              if (
                image.image_url &&
                !images.some(
                  (existingImage) =>
                    existingImage.image_url ===
                    image.image_url
                )
              ) {
                images.push({
                  id: image.id,
                  image_url: image.image_url,
                  isMain: false,
                });
              }
            }
          );

          return {
            ...product,
            images,
          };
        });

      console.log(
        "PRODUCTS WITH IMAGES:",
        productsWithImages
      );

      setProducts(productsWithImages);

      // ========================================
      // RESET CURRENT IMAGE
      // ========================================

      const initialImages = {};

      productsWithImages.forEach(
        (product) => {
          initialImages[product.id] = 0;
        }
      );

      setCurrentImages(initialImages);
    } catch (err) {
      console.error(
        "Fetch products unexpected error:",
        err
      );

      setError(
        err.message ||
          "Could not load products."
      );
    }

    setLoading(false);
  }

  // ==========================================
  // CHANGE PRODUCT IMAGE
  // ==========================================

  function changeProductImage(
    productId,
    imageIndex
  ) {
    setCurrentImages((previous) => ({
      ...previous,
      [productId]: imageIndex,
    }));
  }

  // ==========================================
  // NEXT IMAGE
  // ==========================================

  function nextImage(product) {
    if (!product.images?.length) return;

    const currentIndex =
      currentImages[product.id] || 0;

    const nextIndex =
      (currentIndex + 1) %
      product.images.length;

    changeProductImage(
      product.id,
      nextIndex
    );
  }

  // ==========================================
  // PREVIOUS IMAGE
  // ==========================================

  function previousImage(product) {
    if (!product.images?.length) return;

    const currentIndex =
      currentImages[product.id] || 0;

    const previousIndex =
      currentIndex === 0
        ? product.images.length - 1
        : currentIndex - 1;

    changeProductImage(
      product.id,
      previousIndex
    );
  }

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  function handleEdit(product) {
    setEditingProduct({
      id: product.id,

      name_en:
        product.name_en || "",

      name_ar:
        product.name_ar || "",

      description_en:
        product.description_en || "",

      description_ar:
        product.description_ar || "",

      price:
        product.price || "",

      image_url:
        product.image_url || "",

      available:
        product.available ?? true,

      category_id:
        product.category_id || "",

      subcategory:
        product.subcategory || "",
    });

    setMainImageFile(null);
    setAdditionalImageFiles([]);

    setShowEditModal(true);
  }

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  function closeEditModal() {
    if (saving) return;

    setShowEditModal(false);
    setEditingProduct(null);

    setMainImageFile(null);
    setAdditionalImageFiles([]);
  }

  // ==========================================
  // HANDLE EDIT INPUT
  // ==========================================

  function handleEditChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setEditingProduct((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // ==========================================
  // MAIN IMAGE SELECT
  // ==========================================

  function handleMainImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setMainImageFile(file);
  }

  // ==========================================
  // ADDITIONAL IMAGES SELECT
  // ==========================================

  function handleAdditionalImagesChange(e) {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setAdditionalImageFiles(
      (previous) => [
        ...previous,
        ...files,
      ]
    );

    // Allow selecting the same file again
    e.target.value = "";
  }

  // ==========================================
  // REMOVE SELECTED ADDITIONAL IMAGE
  // ==========================================

  function removeSelectedAdditionalImage(
    index
  ) {
    setAdditionalImageFiles(
      (previous) =>
        previous.filter(
          (_, i) => i !== index
        )
    );
  }

  // ==========================================
  // UPLOAD IMAGE TO SUPABASE STORAGE
  // ==========================================

  async function uploadImage(
    file,
    productId
  ) {
    if (!file) return null;

    const fileExt =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${productId}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

    const filePath =
      `products/${productId}/${fileName}`;

    console.log(
      "Uploading image:",
      filePath
    );

    const {
      error: uploadError,
    } = await supabase.storage
      .from("product-images")
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type || "image/jpeg",
        }
      );

    if (uploadError) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        uploadError
      );

      throw uploadError;
    }

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

    if (
      !publicUrlData ||
      !publicUrlData.publicUrl
    ) {
      throw new Error(
        "Could not get public image URL."
      );
    }

    console.log(
      "IMAGE UPLOADED:",
      publicUrlData.publicUrl
    );

    return publicUrlData.publicUrl;
  }

  // ==========================================
  // SAVE EDIT
  // ==========================================

  async function handleSaveEdit(e) {
    e.preventDefault();

    if (!editingProduct) return;

    setSaving(true);
    setUploadingImages(true);
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

      console.log(
        "UPDATING PRODUCT:",
        id
      );

      // ======================================
      // MAIN IMAGE
      // ======================================

      let finalMainImageUrl =
        image_url || "";

      if (mainImageFile) {
        console.log(
          "Uploading new main image..."
        );

        const uploadedMainImage =
          await uploadImage(
            mainImageFile,
            id
          );

        if (uploadedMainImage) {
          finalMainImageUrl =
            uploadedMainImage;
        }
      }

      // ======================================
      // UPDATE PRODUCT
      // ======================================

      const {
        error: updateError,
      } = await supabase
        .from("products")
        .update({
          name_en,
          name_ar,
          description_en,
          description_ar,

          price:
            Number(price),

          image_url:
            finalMainImageUrl,

          available,

          category_id:
            category_id
              ? Number(category_id)
              : null,

          subcategory:
            subcategory || null,
        })
        .eq("id", id);

      if (updateError) {
        console.error(
          "UPDATE PRODUCT ERROR:",
          updateError
        );

        throw updateError;
      }

      // ======================================
      // ADDITIONAL IMAGES
      // ======================================

      if (
        additionalImageFiles.length >
        0
      ) {
        console.log(
          "Uploading additional images..."
        );

        for (
          const file of
          additionalImageFiles
        ) {
          const uploadedUrl =
            await uploadImage(
              file,
              id
            );

          if (!uploadedUrl) {
            continue;
          }

          const {
            error:
              insertImageError,
          } = await supabase
            .from("product_images")
            .insert({
              product_id: id,
              image_url:
                uploadedUrl,
            });

          if (insertImageError) {
            console.error(
              "INSERT ADDITIONAL IMAGE ERROR:",
              insertImageError
            );

            throw insertImageError;
          }
        }
      }

      // ======================================
      // REFRESH
      // ======================================

      await fetchProducts();

      setMainImageFile(null);
      setAdditionalImageFiles([]);

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

      setError(
        error.message ||
          "Could not update product."
      );

      alert(
        `Could not update product.\n\n${
          error.message ||
          "Unknown error"
        }`
      );
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  async function handleDelete(product) {
    const confirmed =
      window.confirm(
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

      // ========================================
      // DELETE ADDITIONAL IMAGES
      // ========================================

      const {
        error: imagesDeleteError,
      } = await supabase
        .from("product_images")
        .delete()
        .eq(
          "product_id",
          product.id
        );

      if (imagesDeleteError) {
        console.error(
          "Delete product images error:",
          imagesDeleteError
        );
      }

      // ========================================
      // DELETE PRODUCT
      // ========================================

      const {
        error,
      } = await supabase
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
      // REMOVE FROM SCREEN
      // ========================================

      setProducts(
        (currentProducts) =>
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
            (window.location.href =
              "/admin/products/add")
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
                (window.location.href =
                  "/admin/products/add")
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

            {products.map((product) => {

              const images =
                product.images || [];

              const currentIndex =
                currentImages[
                  product.id
                ] || 0;

              const currentImage =
                images[currentIndex]
                  ?.image_url ||
                product.image_url;

              return (
                <div
                  className="admin-product-card"
                  key={product.id}
                >

                  {/* ==================================
                      IMAGE GALLERY
                  ================================== */}

                  <div className="product-image">

                    {currentImage ? (
                      <div
                        style={{
                          position:
                            "relative",
                          width: "100%",
                        }}
                      >

                        <img
                          src={
                            currentImage
                          }
                          alt={
                            product.name_en
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "250px",
                            objectFit:
                              "cover",
                            display:
                              "block",
                          }}
                        />

                        {/* ARROWS */}

                        {images.length >
                          1 && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                previousImage(
                                  product
                                )
                              }
                              style={{
                                position:
                                  "absolute",
                                left:
                                  "10px",
                                top:
                                  "50%",
                                transform:
                                  "translateY(-50%)",
                                width:
                                  "38px",
                                height:
                                  "38px",
                                borderRadius:
                                  "50%",
                                border:
                                  "none",
                                background:
                                  "rgba(0,0,0,0.65)",
                                color:
                                  "white",
                                fontSize:
                                  "22px",
                                cursor:
                                  "pointer",
                                zIndex: 2,
                              }}
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                nextImage(
                                  product
                                )
                              }
                              style={{
                                position:
                                  "absolute",
                                right:
                                  "10px",
                                top:
                                  "50%",
                                transform:
                                  "translateY(-50%)",
                                width:
                                  "38px",
                                height:
                                  "38px",
                                borderRadius:
                                  "50%",
                                border:
                                  "none",
                                background:
                                  "rgba(0,0,0,0.65)",
                                color:
                                  "white",
                                fontSize:
                                  "22px",
                                cursor:
                                  "pointer",
                                zIndex: 2,
                              }}
                            >
                              ›
                            </button>
                          </>
                        )}

                        {/* IMAGE COUNT */}

                        {images.length >
                          1 && (
                          <div
                            style={{
                              position:
                                "absolute",
                              right:
                                "10px",
                              bottom:
                                "10px",
                              background:
                                "rgba(0,0,0,0.7)",
                              color:
                                "white",
                              padding:
                                "5px 10px",
                              borderRadius:
                                "15px",
                              fontSize:
                                "13px",
                              zIndex: 2,
                            }}
                          >
                            {currentIndex +
                              1}{" "}
                            /{" "}
                            {
                              images.length
                            }
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="no-image">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* ==================================
                      THUMBNAILS
                  ================================== */}

                  {images.length >
                    1 && (
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "8px",
                        padding:
                          "10px",
                        overflowX:
                          "auto",
                        background:
                          "#f8f5f0",
                      }}
                    >

                      {images.map(
                        (
                          image,
                          index
                        ) => (
                          <button
                            type="button"
                            key={
                              image.id
                            }
                            onClick={() =>
                              changeProductImage(
                                product.id,
                                index
                              )
                            }
                            style={{
                              padding:
                                "2px",
                              border:
                                currentIndex ===
                                index
                                  ? "2px solid #8b5e3c"
                                  : "2px solid transparent",
                              borderRadius:
                                "6px",
                              background:
                                "white",
                              cursor:
                                "pointer",
                              flexShrink:
                                0,
                            }}
                          >

                            <img
                              src={
                                image.image_url
                              }
                              alt=""
                              style={{
                                width:
                                  "55px",
                                height:
                                  "55px",
                                objectFit:
                                  "cover",
                                borderRadius:
                                  "4px",
                                display:
                                  "block",
                              }}
                            />

                          </button>
                        )
                      )}

                    </div>
                  )}

                  {/* ==================================
                      INFO
                  ================================== */}

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
                        {
                          product.subcategory
                        }
                      </p>
                    )}

                    <strong>
                      ${product.price}
                    </strong>

                    {/* AVAILABILITY */}

                    <p
                      style={{
                        color:
                          product.available
                            ? "green"
                            : "#c62828",
                        fontWeight:
                          "700",
                        fontSize:
                          "15px",
                      }}
                    >
                      {product.available
                        ? "✓ Available"
                        : "× Not Available"}
                    </p>

                    {/* IMAGE COUNT */}

                    {images.length >
                      0 && (
                      <p
                        style={{
                          fontSize:
                            "13px",
                          color:
                            "#777",
                          margin:
                            "5px 0",
                        }}
                      >
                        📷{" "}
                        {images.length}{" "}
                        {images.length ===
                        1
                          ? "image"
                          : "images"}
                      </p>
                    )}

                    {/* ACTIONS */}

                    <div className="product-actions">

                      <button
                        className="edit-product-btn"
                        onClick={() =>
                          handleEdit(
                            product
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-product-btn"
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

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

              {/* ==================================
                  MODAL HEADER
              ================================== */}

              <div className="edit-modal-header">

                <div>

                  <p>
                    Edit Product
                  </p>

                  <h2>
                    {editingProduct.name_en ||
                      "Product"}
                  </h2>

                </div>

                <button
                  className="close-modal-btn"
                  onClick={
                    closeEditModal
                  }
                  disabled={saving}
                >
                  ×
                </button>

              </div>

              {/* ==================================
                  FORM
              ================================== */}

              <form
                onSubmit={
                  handleSaveEdit
                }
                className="edit-product-form"
              >

                {/* ==================================
                    ENGLISH NAME
                ================================== */}

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

                {/* ==================================
                    ARABIC NAME
                ================================== */}

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

                {/* ==================================
                    ENGLISH DESCRIPTION
                ================================== */}

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

                {/* ==================================
                    ARABIC DESCRIPTION
                ================================== */}

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

                {/* ==================================
                    PRICE
                ================================== */}

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

                {/* ==================================
                    MAIN IMAGE UPLOAD
                ================================== */}

                <div className="form-group">

                  <label>
                    Main Product Image
                  </label>

                  {/* CURRENT MAIN IMAGE */}

                  {editingProduct.image_url && (
                    <div
                      style={{
                        marginBottom:
                          "12px",
                      }}
                    >

                      <img
                        src={
                          editingProduct.image_url
                        }
                        alt="Current product"
                        style={{
                          width:
                            "140px",
                          height:
                            "140px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "10px",
                          border:
                            "1px solid #ddd",
                          display:
                            "block",
                        }}
                      />

                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleMainImageChange
                    }
                  />

                  {mainImageFile && (
                    <p
                      style={{
                        fontSize:
                          "13px",
                        color:
                          "#777",
                        marginTop:
                          "6px",
                      }}
                    >
                      Selected:{" "}
                      {
                        mainImageFile.name
                      }
                    </p>
                  )}

                </div>

                {/* ==================================
                    ADDITIONAL IMAGES
                ================================== */}

                <div className="form-group">

                  <label>
                    Additional Product
                    Images
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleAdditionalImagesChange
                    }
                  />

                  <p
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#777",
                      marginTop:
                        "6px",
                    }}
                  >
                    You can select
                    multiple images
                    from your device.
                  </p>

                  {/* NEW IMAGE PREVIEWS */}

                  {additionalImageFiles.length >
                    0 && (
                    <div
                      style={{
                        display:
                          "flex",
                        gap:
                          "10px",
                        flexWrap:
                          "wrap",
                        marginTop:
                          "12px",
                      }}
                    >

                      {additionalImageFiles.map(
                        (
                          file,
                          index
                        ) => {

                          const preview =
                            URL.createObjectURL(
                              file
                            );

                          return (
                            <div
                              key={`${file.name}-${index}`}
                              style={{
                                position:
                                  "relative",
                              }}
                            >

                              <img
                                src={
                                  preview
                                }
                                alt=""
                                style={{
                                  width:
                                    "90px",
                                  height:
                                    "90px",
                                  objectFit:
                                    "cover",
                                  borderRadius:
                                    "8px",
                                  border:
                                    "1px solid #ddd",
                                }}
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeSelectedAdditionalImage(
                                    index
                                  )
                                }
                                style={{
                                  position:
                                    "absolute",
                                  top:
                                    "-7px",
                                  right:
                                    "-7px",
                                  width:
                                    "24px",
                                  height:
                                    "24px",
                                  borderRadius:
                                    "50%",
                                  border:
                                    "none",
                                  background:
                                    "#c62828",
                                  color:
                                    "white",
                                  cursor:
                                    "pointer",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                ×
                              </button>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>

                {/* ==================================
                    SUBCATEGORY
                ================================== */}

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

                {/* ==================================
                    AVAILABLE
                ================================== */}

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

                {/* ==================================
                    BUTTONS
                ================================== */}

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
                    {uploadingImages
                      ? "Uploading images..."
                      : saving
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