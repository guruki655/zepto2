import React from 'react';
import { useCart } from '../contexts/cartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount
  } = useCart();
  
  const navigate = useNavigate();

  // Calculate discount (10% for example)
  const discount = cartTotal * 0.1;
  const totalAfterDiscount = cartTotal - discount;

  return (
    <div className="container mt-4">
      <h2>Your Cart ({cartCount} items)</h2>
      
      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <button className="btn btn-link" onClick={() => navigate('/')}>Continue shopping</button>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.ProductID} className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={`data:image/png;base64,${item.ProductImage}`}
                        className="img-fluid rounded-start"
                        alt={item.ProductName}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.ProductName}</h5>
                        <p className="card-text">₹{item.ProductPrice}</p>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => removeFromCart(item.ProductID)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                          <span className="ms-auto fw-bold">
                            ₹{(item.quantity * parseFloat(item.ProductPrice)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount (10%)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>₹{totalAfterDiscount.toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => navigate('/Payment')}
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    className="btn btn-outline-danger w-100 mt-2"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;