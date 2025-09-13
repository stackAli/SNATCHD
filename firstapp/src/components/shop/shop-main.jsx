import React from "react"
import { Link } from "react-router-dom";
import './shop-main.css'

function ShopMain() {
  return (
    <div className="grid-container">
      <div className="grid-column-1">
        <h1>Our Shop</h1>
        <p>Discover the elegance of handcrafted jewelry, where every piece tells a story.</p>
        <button onClick={() => window.scrollBy({ top: 500, behavior: 'smooth' })}>
            Explore our Products
        </button>

      </div>
      <div className="grid-column-2"><img src="/images/shop-logo.jpg" alt="home page image" />
      </div>

      
    </div>
    
  );
}

export default ShopMain;


