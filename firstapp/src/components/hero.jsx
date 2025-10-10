import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './hero.css';

const API_URL = "https://whimsyjewels.pythonanywhere.com";

const categoryImages = {
  Ring: "/images/rings.avif",
  Earring: "/images/earrings.avif",  // fixed typo here
  Bracelet: "/images/bracelet.avif",
};

function Hero() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  return (
    <div className="hero" >
      <div className="hero-header">
        <h1>Explore Everything</h1>
        <Link to="/shop">
          <button className="shop-button">Shop Our Products</button>
        </Link>
      </div>

      <div className="hero-grid">
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            to={`/shop/${cat.name.toLowerCase()}`} 
            className="hero-grid-item-link"
          >
            <div className="hero-grid-item">
              <div className="hero-image-wrapper">
                <img src={categoryImages[cat.name]} alt={cat.name} />
              </div>
              <h3>{cat.name}</h3>
              <p>
                {cat.product_count} {cat.name.toLowerCase()}
                {cat.product_count !== 1 ? 's' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hero;
