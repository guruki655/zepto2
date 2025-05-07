import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/cartContext';
import '../styles/product.css'

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const cartProduct = cartItems.find((item) => item.ProductID === product?.ProductID);
  const isOutOfStock = product?.ProductQuantity === 0;

  return (
    <div className="container mt-4">
      {product ? (
        <div className="col-lg-3">
          <div className={`card h-100 ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <img
              src={`data:image/png;base64,${product.ProductImage}`}
              className="card-img-top"
              alt={product.ProductName}
              style={{ height: '220px', objectFit: 'cover' }}
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
              {isOutOfStock ? (
                <p className="text-danger mt-2">Out of Stock</p>
              ) : cartProduct ? (
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => removeFromCart(product.ProductID)}
                  >
                    -
                  </button>
                  <span className="mx-2">{cartProduct.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => addToCart(product)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default ProductPage;