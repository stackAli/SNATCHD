import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './product.css';

function ProductGrid() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;

  // Hardcoded backend URL:
  const API_URL = 'https://snatchd.pythonanywhere.com/api';

  useEffect(() => {
    setPage(1); // Reset to first page when category changes

    const url = category && category.toLowerCase() !== 'all'
      ? `${API_URL}/api/shop?category=${category}`
      : `${API_URL}/api/shop`;

    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Error fetching products:', error);
        setProducts([]);
      });
  }, [category]);

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < products.length) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="shop-container">
      {products.length === 0 ? (
        <p className="no-products">No products found in this category.</p>
      ) : (
        <>
          <div className="product-grid">
            {currentProducts.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`${API_URL}${product.image}`}
                  alt={product.name}
                />
                <h4>{product.name}</h4>
                <p><strong>Rs {product.price.toFixed(2)}</strong></p>
              </div>
            ))}
          </div>

          <div className="pagination-buttons">
            <button onClick={prevPage} disabled={page === 1}>
              Previous
            </button>
            <span> Page {page} </span>
            <button onClick={nextPage} disabled={endIndex >= products.length}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductGrid;
