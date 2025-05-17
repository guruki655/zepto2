import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          setError('Please log in to view your order history.');
          setLoading(false);
          return;
        }

        console.log('Fetching order history from:', `${process.env.REACT_APP_API_BASE_URL}/api/customers/orders/history/${email}`); // Debug log
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customers/orders/history/${email}`);
        console.log('Fetched orders:', response.data); // Log to verify ProductImage
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to fetch order history: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        Your Order History{' '}
        {orders.length > 0 && <small className="text-muted">({orders.length} orders)</small>}
      </h2>
      {orders.length === 0 ? (
        <div className="text-center mt-5">
          <img src="/images/empty-cart.png" alt="Empty Cart" style={{ width: '100px', height: '100px' }} />
          <p className="lead mt-3">You haven't placed any orders yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/Home')}>
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order ID: <code>{order._id}</code></h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Total:</strong> ₹{order.total.toFixed(2)}
              </div>
              <div className="mb-2">
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </div>
              {order.address && (
                <div className="mb-3">
                  <strong>Delivery Address:</strong>
                  <p className="mb-0">
                    {order.address.label}: {order.address.addressLine1}, {order.address.houseNo}, {order.address.building}
                    {order.address.landmark ? `, ${order.address.landmark}` : ''}
                  </p>
                </div>
              )}
              <h6 className="mt-3">Items Ordered:</h6>
              <ul className="list-group list-group-flush">
                {order.items.map((item, index) => (
                  <li key={index} className="list-group-item d-flex align-items-center">
                    <img
                      src={item.ProductImage ? `data:image/png;base64,${item.ProductImage}` : '/images/placeholder.png'}
                      alt={item.ProductName}
                      className="rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                    />
                    <div className="flex-grow-1">
                      <strong>{item.ProductName || 'Unnamed Product'}</strong>
                      <div className="text-muted small">
                        ₹{item.ProductPrice?.toFixed(2) || '0.00'} x {item.ProductQuantity || 0}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;