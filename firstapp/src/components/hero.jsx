import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './hero.css';

const categoryImages = {
  Ring: "/images/rings.avif",
  Earring: "/images/earings.avif",
  Bracelet: "/images/bracelet.avif",
};

function Hero() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  return (
    <div className="hero">
      {/* First parent container */}
      <div className="hero-header">
        <h1>Explore Everything</h1>
        <Link to="/shop">
          <button className="shop-button">Shop Our Products</button>
        </Link>
      </div>

      {/* Second parent container */}
      <div className="hero-grid">
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            to="/shop" 
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
