import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import categories from "../data/categories";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Home() {
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);

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
        categories (
          id,
          name_en,
          name_ar
        )
      `)
      .eq("available", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Customer products error:", error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoadingProducts(false);
  }

  return (
    <main>

      {/* Hero */}
      <Hero />

      {/* Categories */}
      <section className="categories-section">
        <SectionTitle
          title={t.categories.title}
          subtitle={t.categories.subtitle}
        />

        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">

        <SectionTitle
          title={
            t.products?.title ||
            "Featured Products"
          }
          subtitle={
            t.products?.subtitle ||
            "Discover our latest products"
          }
        />

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="products-grid">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

      {/* Bridal Checklist */}
      <section className="checklist-banner">

        <div className="checklist-content">

          <span>💍</span>

          <h2>
            {t.checklist.title}
          </h2>

          <p>
            {t.checklist.subtitle}
          </p>

          <Link
            to="/checklist"
            className="checklist-button"
          >
            {t.checklist.button}
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;