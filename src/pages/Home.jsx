import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import categories from "../data/categories";
import { Link } from "react-router-dom";

function Home() {
  const { t } = useLanguage();

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

<section className="products-section">

  <SectionTitle
    title={t.products.title}
    subtitle={t.products.subtitle}
  />

  <div className="products-grid">

    {products.slice(0, 6).map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ))}

  </div>

</section>

      {/* Bridal Checklist */}
      <section className="checklist-banner">

        <div className="checklist-content">
          <span>💍</span>

          <h2>{t.checklist.title}</h2>

          <p>{t.checklist.subtitle}</p>

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