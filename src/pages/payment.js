import React, { useState } from 'react';

const PaymentComponent = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be exactly 16 digits';
    }

    if (!/^[A-Za-z ]+$/.test(cardHolder)) {
      newErrors.cardHolder = 'Name must only contain letters and spaces';
    }

    if (!/^\d{3}$/.test(cvc)) {
      newErrors.cvc = 'CVC must be exactly 3 digits';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Payment info is valid!');
      // Proceed to backend or next steps
    }
  };

  return (
    <div className="payment-container d-flex flex-column align-items-center">
      <style>
        {`
          .payment-container {
            padding-top: 120px;
            padding-bottom: 40px;
            min-height: 100vh;
            background-color: #f8f9fa;
          }

          .thecard-modern {
            width: 350px;
            border-radius: 15px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4A00E0, #8E2DE2);
            color: white;
            transition: transform 0.3s ease-in-out;
          }

          .thecard-modern:hover {
            transform: scale(1.03);
          }

          .chip {
            width: 40px;
            height: 30px;
            background-color: #ddd;
            border-radius: 6px;
          }

          .brand {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .card-number {
            font-size: 20px;
            letter-spacing: 3px;
          }

          .label {
            font-size: 12px;
            text-transform: uppercase;
            opacity: 0.8;
          }

          .value {
            font-weight: bold;
            font-size: 14px;
          }

          .date select {
            width: 49%;
          }

          .form {
            max-width: 500px;
            width: 100%;
          }
        `}
      </style>

      <div className="creditcard mb-4">
        <div className="thecard-modern shadow-lg text-white p-4">
          <div className="card-top d-flex justify-content-between align-items-center mb-3">
            <div className="chip"></div>
            <div className="brand">VISA</div>
          </div>
          <div className="card-number mb-3">
            1234 5678 9012 3456
          </div>
          <div className="card-bottom d-flex justify-content-between">
            <div>
              <div className="label">Card Holder</div>
              <div className="value">Your Name</div>
            </div>
            <div>
              <div className="label">Expires</div>
              <div className="value">01 / 2018</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form p-3 mt-3 shadow bg-white rounded">
        <form onSubmit={handleSubmit}>
          <label htmlFor="cardnumber">Card Number</label>
          <input
            className='form-control'
            type="text"
            id="cardnumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          {errors.cardNumber && <div className="text-danger small">{errors.cardNumber}</div>}

          <label htmlFor="cardholder" className='mt-3'>Card Holder</label>
          <input
            className='form-control'
            type="text"
            id="cardholder"
            placeholder="John Doe"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
          />
          {errors.cardHolder && <div className="text-danger small">{errors.cardHolder}</div>}

          <label htmlFor="address" className='mt-3'>Address</label>
          <textarea
            className='form-control mb-3'
            id="address"
            placeholder="Address"
            rows={4}
          ></textarea>

          <label htmlFor="exp" className='mt-2'>Expiration Date</label>
          <div className="date d-flex gap-2">
            <select name="month" id="month" className='form-select'>
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
            <select name="year" id="year" className='form-select'>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </div>

          <div className="small mt-3">
            <div className="cvc mb-2">
              <label htmlFor="cvc">CVC</label>
              <input
                className='form-control'
                type="text"
                id="cvc"
                maxLength="3"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
              {errors.cvc && <div className="text-danger small">{errors.cvc}</div>}
            </div>
            <p style={{ fontSize: '12px' }}>
              Three digits, usually found on the back of the card
            </p>
          </div>

          <button type="submit" className='btn btn-success mt-3 w-100'>Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
