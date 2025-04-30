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
        <div className='col-lg-3 mt-4'>
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
              </div>
            </div>
          {/* <h1>{product.ProductName}</h1>
          <p>{product.ProductBrand}</p>
          <p>Price: {product.ProductPrice}</p> */}
          {/* <p>Location: {product.ProductLocation}</p> */}
          {/* <p>Quantity: {product.ProductQuantity}</p> */}



        </div>
     
    
    
    ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default ProductPage;
