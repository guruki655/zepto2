import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/cartContext';

function ProductPage() {
  const { id } = useParams(); // Get the product ID from the URL
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

  return (
    <div className="container mt-4">
      {product ? (
        <div className='col-lg-3'>
          <div className="card h-100">
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

              {cartProduct ? (
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
