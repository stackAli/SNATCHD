import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h2>Whimsy Jewels</h2>
        <a href="https://www.instagram.com/your_insta_id" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} className="instagram-icon" />
        </a>
      </div>

      <div className="footer-column">
        <h3>Company</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>

      <div className="footer-column">
        <h3>Contact</h3>
        <p>Phone: +92 300 1234567</p>
        <p>Instagram: @your_insta_id</p>
        <p>Email: info@whimsyjewels.com</p>
      </div>
    </footer>
  );
}

export default Footer;
