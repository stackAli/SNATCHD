import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css'; // ← Import CSS here

const API_BASE = 'https://whimsyjewels.pythonanywhere.com';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
  };

  const removeItem = (id) => {
    const filtered = cartItems.filter(item => item.id !== id);
    setCartItems(filtered);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your cart is empty.</h2>
        <button className="go-back-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.map(item => (
        <div className="cart-item" key={item.id}>
          <img src={`${API_BASE}${item.image}`} alt={item.name} />
          <div>
            <h3>{item.name}</h3>
            <p>Price per item: Rs {item.price.toFixed(2)}</p>
            <div className="cart-actions">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>
            <p><strong>Total: Rs {(item.price * item.quantity).toFixed(2)}</strong></p>
            <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        </div>
      ))}

      <h3>Total Cart Price: Rs {totalPrice.toFixed(2)}</h3>

      <div className="cart-buttons">
        <button className="go-back-btn" onClick={() => navigate('/shop')}>Continue Shopping</button>
        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
