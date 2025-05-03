import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("sajbdvasjdasjdbksha")
    const fetchOrderHistory = async () => {
      try {
        const email = localStorage.getItem('email');
        console.log('Fetching order history for email:', email);
        if (!email) {
          setError('Please log in to view your order history.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/customers/orders/history/${email}`);
        console.log('Order history response:', response.data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Order ID: {order._id}</h5>
              <p className="card-text">Total: ₹{order.total.toFixed(2)}</p>
              <p className="card-text">Date: {new Date(order.createdAt).toLocaleString()}</p>
              {order.address && (
                <div>
                  <h6>Delivery Address:</h6>
                  <p>
                    {order.address.label}: {order.address.addressLine1}, {order.address.houseNo}, {order.address.building}
                    {order.address.landmark ? `, ${order.address.landmark}` : ''}
                  </p>
                </div>
              )}
              <h6>Items:</h6>
              <ul>
  {order.items.map((item, index) => (
    <li key={index}>
      {item.ProductName || "Unnamed Product"} - ₹{(item.ProductPrice?.toFixed(2) || "0.00")} x {item.ProductQuantity || 0}
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