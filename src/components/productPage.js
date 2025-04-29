// ProductPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductPage() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const res = await axios.get(`http://localhost:5000/api/customers/${id}`);
            setProduct(res.data); // Store the product details in state
          } catch (err) {
            console.error('Error fetching product:', err);
          }
        };
      
        fetchProduct();
      }, [id]);

  return (
    <div>
      {product ? (
        <div>
          <h1>{product.ProductName}</h1>
          <p>{product.ProductDescription}</p>
          <p>Price: {product.ProductPrice}</p>
          <p>Location: {product.ProductLocation}</p>
          <p>Quantity: {product.ProductQuantity}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default ProductPage;
