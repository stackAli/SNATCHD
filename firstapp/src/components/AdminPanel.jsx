import React, { useState, useEffect } from 'react';
import Login from './login'; // Make sure filename matches
const API_BASE =
  window.location.hostname.includes('localhost')
    ? 'http://127.0.0.1:5000/api' // Local Flask for development
    : 'https://snatchd.pythonanywhere.com/api';; // Live Flask for production


function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(null); // null = checking login
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '' });
  const [imageFile, setImageFile] = useState(null);

  // ✅ Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_BASE}/check-login`, { credentials: 'include' });
        if (res.ok) setLoggedIn(true);
        else setLoggedIn(false);
      } catch (err) {
        console.error('Login check failed:', err);
        setLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  // ✅ Fetch products and categories when logged in
  useEffect(() => {
    if (!loggedIn) return;

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/shop`, { credentials: 'include' }),
          fetch(`${API_BASE}/admin/categories`, { credentials: 'include' })
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setForm(f => ({ ...f, category_id: categoriesData[0].id }));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [loggedIn]);

  // ✅ Add new product
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !imageFile) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category_id', form.category_id);
    formData.append('image', imageFile);

    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');

      setProducts(prev => [...prev, data.product]);
      setForm({ name: '', description: '', price: '', category_id: categories[0]?.id || '' });
      setImageFile(null);
      e.target.reset();
      alert('✅ Product added successfully!');
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  // ✅ Delete product
  const deleteProduct = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
      setLoggedIn(false);
      alert('Logged out successfully');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // ✅ UI rendering
  if (loggedIn === null) return <p>Loading...</p>;
  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  // ✅ Render admin panel
  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>🛠️ Admin Panel</h2>
      <button
        onClick={handleLogout}
        style={{
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
          float: 'right'
        }}
      >
        Logout
      </button>

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '40px' }}>
        <h3>Add New Product</h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
          required
        />
        <select
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: parseInt(e.target.value, 10) })}
        >
          {Array.isArray(categories) &&
            categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <button type="submit" style={{ display: 'block', marginTop: '10px' }}>
          Add Product
        </button>
      </form>

      <h3 style={{ marginTop: '30px' }}>Existing Products</h3>
      <ul>
        {Array.isArray(products) && products.length > 0 ? (
          products.map(p => (
            <li key={p.id}>
              {p.name} — Rs {parseFloat(p.price).toFixed(2)}{' '}
              <button onClick={() => deleteProduct(p.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No products yet.</p>
        )}
      </ul>
    </div>
  );
}

export default AdminPanel;
