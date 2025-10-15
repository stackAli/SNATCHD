import React from 'react';
import { NavLink } from 'react-router-dom';
import './shop-nav.css';

function CategoryNav() {
  const categories = ['All', 'Tops', 'Bottom', 'Shoes'];

  return (
    <div className="start">
      <h1>Shop By Category</h1>
      <nav className="category-nav">
        {categories.map((cat) => (
          <NavLink
            key={cat}
            to={`/shop/${cat}`}
            className={({ isActive }) =>
              isActive ? 'nav-link2 active' : 'nav-link2'
            }
          >
            {cat === 'All' ? 'All' : `${cat}`}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default CategoryNav;
