import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/cartContext';
import '../styles/category.css';

function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useCart();
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/customers');
        const allProducts = res.data;

        const normalizedCategory = categoryName.toLowerCase();
        const filteredProducts = allProducts.filter(
          (product) => product.ProductType.toLowerCase() === normalizedCategory
        );

        const filteredSubcategories = [
          ...new Set(filteredProducts.map((product) => product.ProductSubType)),
        ].sort();

        setProducts(filteredProducts);
        setSubcategories(filteredSubcategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  const ProductCard = ({ product }) => {
    const cartProduct = cartItems.find((item) => item.ProductID === product.ProductID);
    const quantity = cartProduct ? cartProduct.quantity : 0;

    return (
      <div className="col-lg-3" style={{ cursor: 'pointer' }}>
        <div className="card h-100">
          <img
            src={`data:image/png;base64,${product.ProductImage}`}
            className="card-img-top"
            alt={product.ProductName}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body">
            <h5 className="card-title">{product.ProductName}</h5>
            <p className="card-text">Brand: {product.ProductBrand}</p>
            <p className="card-text">Price: ₹{product.ProductPrice}</p>
            <div className="card-text">
              Rating:{' '}
              {Array.from({ length: Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i} className="fas fa-star text-warning" />
              ))}
              {Array.from({ length: 5 - Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i + Math.floor(product.ProductRating || 1)} className="far fa-star text-warning" />
              ))}
            </div>
            {cartProduct ? (
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(product.ProductID);
                  }}
                >
                  -
                </button>
                <span className="mx-2">{quantity}</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  let displayedProducts = selectedSubcategory
    ? products.filter(
        (product) => product.ProductSubType.toLowerCase() === selectedSubcategory.toLowerCase()
      )
    : products;

  displayedProducts = [...displayedProducts].sort((a, b) => {
    const priceA = parseFloat(a.ProductPrice);
    const priceB = parseFloat(b.ProductPrice);
    const ratingA = parseFloat(a.ProductRating);
    const ratingB = parseFloat(b.ProductRating);

    if (sortOption === 'price-low') {
      return priceA - priceB;
    } else if (sortOption === 'price-high') {
      return priceB - priceA;
    } else if (sortOption === 'rating-high') {
      return ratingB - ratingA;
    }
    return 0;
  });

  return (
    <div className="category-page">
      <div className="zepto-sidebar">
        <div className="-loop-sidebar-header">
          <h5>{categoryName} Subcategories</h5>
          <button className="btn btn-close" onClick={() => navigate('/')}></button>
        </div>
        <div className="zepto-sidebar-body">
          {loading ? (
            <p>Loading subcategories...</p>
          ) : error ? (
            <p className="zepto-sidebar-error">{error}</p>
          ) : (
            <ul>
              {subcategories.length > 0 ? (
                <>
                  <li
                    className={`zepto-sidebar-item ${selectedSubcategory === null ? 'active' : ''}`}
                    onClick={() => setSelectedSubcategory(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    All
                  </li>
                  {subcategories.map((subcategory, index) => (
                    <li
                      key={index}
                      className={`zepto-sidebar-item ${selectedSubcategory === subcategory ? 'active' : ''}`}
                      onClick={() => setSelectedSubcategory(subcategory)}
                      style={{ cursor: 'pointer' }}
                    >
                      {subcategory}
                    </li>
                  ))}
                </>
              ) : (
                <li className="zepto-sidebar-item">No subcategories available</li>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="category-content">
        <h2>{categoryName}</h2>
        <div className="sort-container">
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort by: Default</option>
            <option value="price-low">Sort by: Price Low to High</option>
            <option value="price-high">Sort by: Price High to Low</option>
            <option value="rating-high">Sort by: Rating High to Low</option>
          </select>
        </div>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="zepto-sidebar-error">{error}</p>
        ) : displayedProducts.length > 0 ? (
          <div className="row">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p>No products available for {selectedSubcategory || categoryName}.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;