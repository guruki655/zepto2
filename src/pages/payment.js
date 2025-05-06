import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/cartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentComponent = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState({});
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    const address = JSON.parse(localStorage.getItem('userAddress'));
    setSavedAddress(address || null);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!cardNumber || cardNumber.length < 12) newErrors.cardNumber = 'Enter a valid card number (at least 12 digits).';
    if (!cardHolder.trim()) newErrors.cardHolder = 'Card holder name is required.';
    if (!cvc || cvc.length !== 3) newErrors.cvc = 'CVC must be 3 digits.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const email = localStorage.getItem('email');
    if (!email || email === 'undefined') {
      alert('Please log in first.');
      navigate('/Login');
      return;
    }

    const orderData = {
      email,
      items: cartItems.map((item) => ({
        ProductID: item.ProductID,  
        ProductName: item.ProductName,
        ProductPrice: parseFloat(item.ProductPrice),
        ProductQuantity: item.quantity,
      })),
      total: cartTotal,
      address: savedAddress,
    };

    console.log('Sending order data:', orderData); // Add logging

    try {
      const response = await axios.post('http://localhost:5000/api/customers/orders/save', orderData);
      console.log('Order save response:', response.data); // Add logging

      if (response.status === 201) {
        alert('Payment successful and order saved!');
        clearCart();
        navigate('/orders');
      } else {
        alert('Failed to save order: ' + response.data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred while saving the order: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="payment-container d-flex flex-column align-items-center" style={{ minHeight: '100vh', padding: '20px' }}>
      {savedAddress && (
        <div className="mb-3 text-start w-100" style={{ maxWidth: '350px' }}>
          <h6>Delivery to:</h6>
          <p>
            {savedAddress.label}: {savedAddress.addressLine1}, {savedAddress.houseNo}, {savedAddress.building}
            {savedAddress.landmark ? `, ${savedAddress.landmark}` : ''}
          </p>
        </div>
      )}

      <div className="creditcard mb-4">
        <div className="thecard-modern shadow-lg text-white p-4" style={{ background: 'linear-gradient(135deg, #1e90ff, #00bfff)', borderRadius: '15px', width: '350px', height: '200px' }}>
          <div className="card-top d-flex justify-content-between align-items-center mb-3">
            <div className="chip" style={{ width: '40px', height: '30px', background: '#d4af37', borderRadius: '5px' }}></div>
            <div className="brand" style={{ fontSize: '24px', fontWeight: 'bold' }}>VISA</div>
          </div>
          <div className="card-number mb-3" style={{ fontSize: '20px', letterSpacing: '2px' }}>
            **** **** **** {cardNumber.slice(-4) || '0000'}
          </div>
          <div className="card-bottom d-flex justify-content-between">
            <div>
              <div className="label" style={{ fontSize: '12px' }}>Card Holder</div>
              <div className="value" style={{ fontSize: '16px' }}>{cardHolder || 'Your Name'}</div>
            </div>
            <div>
              <div className="label" style={{ fontSize: '12px' }}>Expires</div>
              <div className="value" style={{ fontSize: '16px' }}>01 / 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form p-3 mt-3 shadow bg-white rounded" style={{ width: '350px' }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="cardnumber" className="form-label">Card Number</label>
          <input
            className="form-control"
            type="text"
            id="cardnumber"
            maxLength="16"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
          />
          {errors.cardNumber && <div className="text-danger small mt-1">{errors.cardNumber}</div>}

          <label htmlFor="cardholder" className="form-label mt-3">Card Holder</label>
          <input
            className="form-control"
            type="text"
            id="cardholder"
            placeholder="John Doe"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
          />
          {errors.cardHolder && <div className="text-danger small mt-1">{errors.cardHolder}</div>}

          <label htmlFor="exp" className="form-label mt-2">Expiration Date</label>
          <div className="date d-flex gap-2">
            <select name="month" id="month" className="form-select">
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
            <select name="year" id="year" className="form-select">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </div>

          <div className="small mt-3">
            <div className="cvc mb-2">
              <label htmlFor="cvc" className="form-label">CVC</label>
              <input
                className="form-control"
                type="text"
                id="cvc"
                maxLength="3"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              />
              {errors.cvc && <div className="text-danger small mt-1">{errors.cvc}</div>}
            </div>
            <p style={{ fontSize: '12px' }}>Three digits, usually found on the back of the card</p>
          </div>

          <button type="submit" className="btn btn-success mt-3 w-100">Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;