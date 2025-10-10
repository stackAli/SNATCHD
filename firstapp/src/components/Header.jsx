import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const cartItemCount = 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const brandStyle = {
    fontFamily: "'Didot', serif",
    color: '#1c3c43',
  };

  const navLinkStyle = {
    color: '#1c3c43',
    fontWeight: '300',
    letterSpacing: '1px',
    cursor: 'pointer',
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light navbar-custom py-3 shadow-sm">
        <div className="container-fluid">
          {/* Hamburger Menu Button (mobile only) */}
          <button
            className="hamburger-btn d-lg-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1c3c43' }}>×</span>
            ) : (
              <>
                <span></span>
                <span></span>
                <span></span>
              </>
            )}
          </button>

          {/* Navigation Links */}
          <div ref={menuRef} className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link"
                  style={navLinkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>

              {/* OUR SHOP dropdown using Bootstrap */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="shopDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={navLinkStyle}
                >
                  OUR SHOP
                </a>
                <ul className="dropdown-menu" aria-labelledby="shopDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/shop"
                      onClick={() => setMenuOpen(false)}
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/AdminPanel"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link
                  to="/contactus"
                  className="nav-link"
                  style={navLinkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>

          {/* Center brand */}
          <Link to="/" className="navbar-brand fs-3 fw-bold" style={brandStyle}>
            SNATCHD
          </Link>

          {/* Right side cart icon */}
          <div className="d-flex align-items-center gap-3">
            <div className="cart-wrapper">
              <Link to="/cart" className="btn btn-light position-relative p-2">
                <i className="fas fa-shopping-cart fa-lg"></i>
                {cartItemCount > 0 && (
                  <span className="cart-badge-custom">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
         </div>

        </div>
      </nav>

      {/* Push content below sticky navbar */}
      <div className="header-spacer"></div>
    </>
  );
}

export default Header;
