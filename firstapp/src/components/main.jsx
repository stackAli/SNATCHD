import React from "react"
import { Link } from "react-router-dom";
import './Main.css'
function Main() {
  return (
    <div className="grid-container">
      <div className="grid-column-1">
        <h1>Modern Hand Crafted Jewelry</h1>
        <p>Discover the elegance of handcrafted jewelry, where every piece tells a story.</p>
        <Link to="/shop">
          <button className="main-button">Shop Our Products</button>
        </Link>
      </div>
      <div className="grid-column-2"><img src="/images/logo.jpg" alt="home page image" />
      </div>

      
    </div>
    
  );
}

export default Main;


