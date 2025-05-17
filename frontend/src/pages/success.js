import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/cartContext';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      if (!sessionId) {
        setError('Invalid session. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        const email = localStorage.getItem('email');
        const address = JSON.parse(localStorage.getItem('userAddress') || '{}');

        if (!email || !address || !address.addressLine1) {
          setError('Missing user information. Please log in and ensure an address is saved.');
          setIsLoading(false);
          return;
        }

        console.log('Saving order with:', { sessionId, email, address });
        console.log('Saving order to:', `${process.env.REACT_APP_API_BASE_URL}/api/customers/orders/save`); // Debug log

        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customers/orders/save`, {
          email,
          address,
          sessionId,
        });

        console.log('Order saved:', response.data);
        clearCart();
        setIsLoading(false);
        navigate('/orders'); // Redirect to order history
      } catch (error) {
        console.error('Error saving order:', error);
        setError(`Failed to save order: ${error.response?.data?.message || error.message}`);
        setIsLoading(false);
      }
    };

    saveOrder();
  }, [location, navigate, clearCart]);

  return (
    <div className="container mt-5 text-center">
      {isLoading ? (
        <>
          <h2>Processing Your Order...</h2>
          <p>Please wait while we finalize your order.</p>
        </>
      ) : error ? (
        <>
          <h2>Order Processing Failed</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/cart')}>
            Return to Cart
          </button>
        </>
      ) : (
        <>
          <h2>Order Placed Successfully!</h2>
          <p>Your order has been processed. Check your order history for details.</p>
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>
            View Order History
          </button>
        </>
      )}
    </div>
  );
};

export default Success;