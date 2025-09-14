import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './details.css';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // ✅ Use your live API instead of localhost
  const API_BASE = "https://whimsyjewels.pythonanywhere.com";

  useEffect(() => {
    fetch(`${API_BASE}/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity: parseInt(quantity, 10)
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = existingCart.findIndex(item => item.id === cartItem.id);

    if (index >= 0) {
      existingCart[index].quantity += cartItem.quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));

    alert(`Added ${cartItem.quantity} ${product.name}(s) to cart`);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="details-card">
        <div className="image-side">
          {/* ✅ Load image from PythonAnywhere */}
          <img src={`${API_BASE}${product.image}`} alt={product.name} />
        </div>
        <div className="info-side">
          <h1>{product.name}</h1>
          <p><strong>Price:</strong> Rs {product.price.toFixed(2)}</p>
          <p><strong>Description:</strong> {product.description}</p>

          <div
            className="cart-count"
            style={{ display: 'flex', gap: '40px', alignItems: 'center', marginTop: '20px' }}
          >
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={{ width: '100px', padding: '15px 40px' }}
            />
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
