import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: 1 });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/shop')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !imageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category_id', form.category_id);
    formData.append('image', imageFile);

    fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add product');
        return res.json();
      })
      .then(data => {
        setProducts(prev => [...prev, data.product]);
        setForm({ name: '', description: '', price: '', category_id: 1 });
        setImageFile(null);
        e.target.reset();  // reset file input
      })
      .catch(err => alert(err.message));
  };

  const deleteProduct = id => {
    fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete product');
        setProducts(prev => prev.filter(p => p.id !== id));
      })
      .catch(err => alert(err.message));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <option value={1}>Ring</option>
          <option value={6}>Earring</option>
          <option value={3}>Bracelet</option>
        </select>

        <button type="submit">Add Product</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - Rs {p.price.toFixed(2)}{' '}
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
