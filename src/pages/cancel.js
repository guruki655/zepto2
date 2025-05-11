import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Payment Canceled</h2>
      <p>Your payment was not completed. Please try again.</p>
      <button className="btn btn-primary" onClick={() => navigate('/payment')}>
        Try Again
      </button>
    </div>
  );
}

export default Cancel;