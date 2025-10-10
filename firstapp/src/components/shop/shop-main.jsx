import React from "react"
import { Link } from "react-router-dom";
import './shop-main.css'

function ShopMain() {
  return (
    <div className="grid-container">
      <div className="grid-column-1">
        <h1>Our Thrift Collection</h1>
         <p>Refresh your wardrobe sustainably with pre-loved styles that never go out of fashion.</p>

        <button onClick={() => window.scrollBy({ top: 500, behavior: 'smooth' })}>
            Explore our Products
        </button>

      </div>
      <div className="grid-column-2"><img src="/images/logo.jpg" alt="home page image" />
      </div>

      
    </div>
    
  );
}

export default ShopMain;


