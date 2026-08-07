import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-small-title">
          ✨ Your New Home Starts Here
        </p>

        <h1>{t.hero.title}</h1>

        <p className="hero-description">
          {t.hero.subtitle}
        </p>

        <Link to="/categories" className="hero-button">
          {t.hero.button}
        </Link>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80"
          alt="Beautiful kitchen"
        />
      </div>
    </section>
  );
}

export default Hero;