import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/cartContext';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RNEmFPxiXl6gYuTxfzucygRKGJRsU3IIfkVCA580gF63522WkXs4la3gE6r6YAewOk1ngzRwFPgYy2SdcWkvdPO00brPbqZwl');

const PaymentComponent = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // Get location to access state
  const [savedAddress, setSavedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get totalAfterDiscount from location state, fallback to cartTotal
  const totalAfterDiscount = location.state?.totalAfterDiscount || cartTotal;

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedAddress = JSON.parse(localStorage.getItem('userAddress'));
        if (storedAddress && storedAddress.addressLine1) {
          setSavedAddress(storedAddress);
          return;
        }

        if (token) {
          console.log('Fetching address from:', `${process.env.REACT_APP_API_BASE_URL}/api/customers/users/address`); // Debug log
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customers/users/address`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.address) {
            setSavedAddress(response.data.address);
            localStorage.setItem('userAddress', JSON.stringify(response.data.address));
          }
        }
      } catch (error) {
        console.error('Error loading address:', error);
        try {
          const storedAddress = JSON.parse(localStorage.getItem('userAddress'));
          if (storedAddress && storedAddress.addressLine1) {
            setSavedAddress(storedAddress);
          } else {
            setSavedAddress(null);
          }
        } catch (parseError) {
          console.error('Error parsing userAddress:', parseError);
          setSavedAddress(null);
        }
      }
    };
    loadAddress();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = localStorage.getItem('email');
    if (!email || email === 'undefined') {
      alert('Please log in first.');
      navigate('/Login');
      setIsLoading(false);
      return;
    }

    if (!savedAddress || !savedAddress.addressLine1) {
      alert('Please add a shipping address.');
      navigate('/cart');
      setIsLoading(false);
      return;
    }

    const orderData = {
      email,
      items: cartItems.map((item) => ({
        ProductID: item.ProductID,
        ProductName: item.ProductName,
        ProductPrice: parseFloat(item.ProductPrice),
        ProductQuantity: item.quantity,
        ProductImage: item.ProductImage,
      })),
      total: totalAfterDiscount, // Use discounted total
      address: savedAddress,
    };

    console.log('Sending checkout data:', orderData);

    try {
      console.log('Creating checkout session at:', `${process.env.REACT_APP_API_BASE_URL}/api/customers/create-checkout-session`); // Debug log
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customers/create-checkout-session`, orderData);
      console.log('Checkout session response:', response.data);

      const sessionId = response.data.id;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error redirecting to Checkout:', error);
        alert(`Failed to initiate checkout: ${error.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error.response?.data?.message || error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container d-flex flex-column align-items-center" style={{ minHeight: '100vh', padding: '20px' }}>
      {savedAddress && (
        <div className="mb-3 text-start w-100" style={{ maxWidth: '350px' }}>
          <h6>Delivery to:</h6>
          <p>
            {savedAddress.label}: {savedAddress.addressLine1}, {savedAddress.houseNo}, {savedAddress.building}
            {savedAddress.landmark ? `, ${savedAddress.landmark}` : ''}{savedAddress.zipCode ? `, ${savedAddress.zipCode}` : ''}
          </p>
        </div>
      )}

      <div className="order-summary mb-4 w-100" style={{ maxWidth: '350px' }}>
        <h6>Order Summary</h6>
        <p>Subtotal: ₹{cartTotal.toFixed(2)}</p>
        <p>Discount: ₹{(cartTotal - totalAfterDiscount).toFixed(2)}</p>
        <p><strong>Total: ₹{totalAfterDiscount.toFixed(2)}</strong></p>
      </div>

      <div className="creditcard mb-4">
        <div className="thecard-modern shadow-lg text-white p-4" style={{ background: 'linear-gradient(135deg, #1e90ff, #00bfff)', borderRadius: '15px', width: '350px', height: '200px' }}>
          <div className="card-top d-flex justify-content-between align-items-center mb-3">
            <div className="chip" style={{ width: '40px', height: '30px', background: '#d4af37', borderRadius: '5px' }}></div>
            <div className="brand" style={{ fontSize: '24px', fontWeight: 'bold' }}>VISA</div>
          </div>
          <div className="card-number mb-3" style={{ fontSize: '20px', letterSpacing: '2px' }}>
            **** **** **** 0000
          </div>
          <div className="card-bottom d-flex justify-content-between">
            <div>
              <div className="label" style={{ fontSize: '12px' }}>Card Holder</div>
              <div className="value" style={{ fontSize: '16px' }}>Your Name</div>
            </div>
            <div>
              <div className="label" style={{ fontSize: '12px' }}>Expires</div>
              <div className="value" style={{ fontSize: '16px' }}>01 / 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form p-3 mt-3 shadow bg-white rounded" style={{ width: '350px' }}>
        <form onSubmit={handleCheckout}>
          <p className="text-center mb-3">Click below to pay securely with Stripe.</p>
          <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
            {isLoading ? 'Processing...' : `Pay ₹${totalAfterDiscount.toFixed(2)} with Stripe`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;