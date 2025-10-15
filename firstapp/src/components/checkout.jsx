import React, { useEffect, useState } from 'react';
import './checkout.css';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ UPDATED FUNCTION
  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.address) {
      alert('Please fill in all details');
      return;
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    try {
      const response = await fetch('https://snatchd.pythonanywhere.com/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          cartItems,
          totalPrice
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Order placed successfully! You will receive a confirmation email.');
        localStorage.removeItem('cart');
        navigate('/');
      } else {
        alert('❌ Failed to place order: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('⚠️ An error occurred while placing the order.');
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <div className="checkout-container">
        <h2>Checkout</h2>

        <div className="checkout-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInputChange}
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={form.address}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div className="checkout-item" key={item.id}>
            <span>{item.name} (x{item.quantity})</span>
            <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <h4>Total: Rs {totalPrice.toFixed(2)}</h4>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;
