import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/cartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [savedAddress, setSavedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    houseNo: '',
    building: '',
    landmark: '',
    label: 'Home',
    zipCode: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Available coupons
  const availableCoupons = [
    {
      code: 'NEW100',
      discount: 100,
      minPurchase: 150,
      description: 'Get ₹100 off on orders above ₹150',
    },
  ];

  // Bangalore ZIP codes
  const bangaloreZipCodes = [
    '560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009', '560010',
    '560011', '560012', '560013', '560014', '560015', '560016', '560017', '560018', '560019', '560020',
    '560021', '560022', '560023', '560024', '560025', '560026', '560027', '560028', '560029', '560030',
    '560031', '560032', '560033', '560034', '560035', '560036', '560037', '560038', '560039', '560040',
    '560041', '560042', '560043', '560044', '560045', '560046', '560047', '560048', '560049', '560050',
    '560051', '560052', '560053', '560054', '560055', '560056', '560057', '560058', '560059', '560060',
    '560061', '560062', '560063', '560064', '560065', '560066', '560067', '560068', '560069', '560070',
    '560071', '560072', '560073', '560074', '560075', '560076', '560077', '560078', '560079', '560080',
    '560081', '560082', '560083', '560084', '560085', '560086', '560087', '560088', '560089', '560090',
    '560091', '560092', '560093', '560094', '560095', '560096', '560097', '560098', '560099', '560100',
  ];

  // Calculate discounts
  const baseDiscount = cartTotal * 0.1; // Existing 10% discount
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAfterDiscount = cartTotal - baseDiscount - couponDiscount;

  // Fetch saved address
  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/customers/users/address', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched saved address:', response.data);
        if (response.data.address) {
          setSavedAddress(response.data.address);
          localStorage.setItem('userAddress', JSON.stringify(response.data.address));
        }
      } catch (err) {
        console.error('Error fetching saved address:', err);
        try {
          const localAddress = JSON.parse(localStorage.getItem('userAddress'));
          if (localAddress && localAddress.addressLine1) {
            setSavedAddress(localAddress);
          }
        } catch (parseErr) {
          console.error('Error parsing userAddress:', parseErr);
        }
      }
    };

    fetchSavedAddress();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    setAddressError('');
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (cartTotal < coupon.minPurchase) {
      setCouponError(`Minimum purchase of ₹${coupon.minPurchase} required for this coupon`);
      return;
    }

    setAppliedCoupon(coupon);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const isValidBangaloreAddress = (address) => {
    if (!bangaloreZipCodes.includes(address.zipCode)) {
      return false;
    }
    return true; // Rely on ZIP code
  };

  const saveAddressAndProceed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to proceed.');
        navigate('/Login');
        return;
      }
  
      let addressToUse = useSavedAddress && savedAddress ? savedAddress : newAddress;
  
      if (!useSavedAddress) {
        if (!newAddress.addressLine1 || !newAddress.houseNo || !newAddress.building || !newAddress.zipCode) {
          setAddressError('Please fill in all required address fields, including ZIP code.');
          return;
        }
  
        if (!isValidBangaloreAddress(newAddress)) {
          setAddressError('This address is not serviceable. Please use a valid Bangalore ZIP code (e.g., 560001).');
          return;
        }
  
        const response = await axios.put(
          'http://localhost:5000/api/customers/users/update-address',
          { address: newAddress },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Saved new address:', response.data);
        setSavedAddress(newAddress);
        localStorage.setItem('userAddress', JSON.stringify(newAddress));
        addressToUse = newAddress;
      } else if (!savedAddress) {
        setAddressError('No saved address found. Please add a new address.');
        return;
      } else if (!isValidBangaloreAddress(savedAddress)) {
        setAddressError('Saved address is not serviceable. Please add a Bangalore address with a valid ZIP code.');
        return;
      }
  
      localStorage.setItem('userAddress', JSON.stringify(addressToUse));
      setShowAddressModal(false);
      // Pass discounted total to PaymentComponent
      navigate('/payment', { state: { totalAfterDiscount } });
    } catch (err) {
      console.error('Error saving address:', err);
      setAddressError(err.response?.data?.message || 'Failed to save address.');
    }
  };
  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to proceed.');
      navigate('/Login');
      return;
    }
  
    setShowAddressModal(true);
  };
  return (
    <div className="container mt-4">
      <h2>Your Cart ({cartCount} items)</h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty.{' '}
          <button className="btn btn-link" onClick={() => navigate('/')}>
            Continue shopping
          </button>
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
                    <span>-₹{baseDiscount.toFixed(2)}</span>
                  </div>
                  
                  {/* Coupon Section */}
                  <div className="mt-3 mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={handleApplyCoupon}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {couponError && <div className="text-danger small mt-1">{couponError}</div>}
                    {appliedCoupon && (
                      <div className="text-success small mt-1">
                        Coupon applied: {appliedCoupon.code} (-₹{appliedCoupon.discount})
                      </div>
                    )}
                  </div>
                  
                  {appliedCoupon && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>₹{totalAfterDiscount.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={handleProceedToCheckout}
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

          {/* Address Modal */}
          {showAddressModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delivery Address</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddressModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {addressError && (
                      <div className="alert alert-danger">{addressError}</div>
                    )}
                    {savedAddress ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Saved Address</label>
                          <p>
                            {savedAddress.label}: {savedAddress.addressLine1},{' '}
                            {savedAddress.houseNo}, {savedAddress.building}
                            {savedAddress.landmark ? `, ${savedAddress.landmark}` : ''}
                            {savedAddress.zipCode ? `, ${savedAddress.zipCode}` : ''}
                          </p>
                          <div>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => setUseSavedAddress(true)}
                              disabled={useSavedAddress}
                            >
                              Use This Address
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setUseSavedAddress(false)}
                            >
                              Add New Address
                            </button>
                          </div>
                        </div>

                        {!useSavedAddress && (
                          <div>
                            <div className="mb-3">
                              <label className="form-label">Address Line 1 *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="addressLine1"
                                value={newAddress.addressLine1}
                                onChange={handleAddressChange}
                                placeholder="Street address"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">House No. & Floor *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="houseNo"
                                value={newAddress.houseNo}
                                onChange={handleAddressChange}
                                placeholder="Enter house no. and floor"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Building & Block No. *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="building"
                                value={newAddress.building}
                                onChange={handleAddressChange}
                                placeholder="Enter building and block no."
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">ZIP Code *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="zipCode"
                                value={newAddress.zipCode}
                                onChange={handleAddressChange}
                                placeholder="Enter Bangalore ZIP code (e.g., 560001)"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Landmark & Area Name (Optional)</label>
                              <input
                                type="text"
                                className="form-control"
                                name="landmark"
                                value={newAddress.landmark}
                                onChange={handleAddressChange}
                                placeholder="Enter landmark and area name"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Add Address Label</label>
                              <select
                                className="form-select"
                                name="label"
                                value={newAddress.label}
                                onChange={handleAddressChange}
                              >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Address Line 1 *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="addressLine1"
                            value={newAddress.addressLine1}
                            onChange={handleAddressChange}
                            placeholder="Street address"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">House No. & Floor *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="houseNo"
                            value={newAddress.houseNo}
                            onChange={handleAddressChange}
                            placeholder="Enter house no. and floor"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Building & Block No. *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="building"
                            value={newAddress.building}
                            onChange={handleAddressChange}
                            placeholder="Enter building and block no."
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">ZIP Code *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="zipCode"
                            value={newAddress.zipCode}
                            onChange={handleAddressChange}
                            placeholder="Enter Bangalore ZIP code (e.g., 560001)"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Landmark & Area Name (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="landmark"
                            value={newAddress.landmark}
                            onChange={handleAddressChange}
                            placeholder="Enter landmark and area name"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Add Address Label</label>
                          <select
                            className="form-select"
                            name="label"
                            value={newAddress.label}
                            onChange={handleAddressChange}
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={saveAddressAndProceed}
                    >
                      {savedAddress && useSavedAddress ? 'Continue with Saved Address' : 'Save & Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;