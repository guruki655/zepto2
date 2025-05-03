import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!email || email === 'undefined') {
        setError('Please log in to view your order history.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/customers/orders/history/${email}`);
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err.response ? err.response.data : err.message);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  if (loading) return <div style={{ padding: '20px' }}>Loading orders...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '10px',
            }}
          >
            <h4>Order #{idx + 1} — ₹{order.total}</h4>
            <p><small>{new Date(order.createdAt).toLocaleString()}</small></p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.ProductName ? (
                    `${item.ProductName} — ${item.ProductQuantity} pcs @ ₹${item.ProductPrice}`
                  ) : (
                    `Item ID: ${item._id} (Details not available)`
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;