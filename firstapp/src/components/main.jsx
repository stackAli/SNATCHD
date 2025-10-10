import React from "react"
import { Link } from "react-router-dom";
import './Main.css'
function Main() {
  return (
    <div className="grid-container">
      <div className="grid-column-1">
       <h1>Revive Your Style with Thrift Finds</h1>
        <p>Shop one-of-a-kind thrifted pieces that blend vintage charm with modern flair.</p>

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


