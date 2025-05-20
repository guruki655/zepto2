import React, { useState, useEffect } from 'react';
import logo from '../images/zeptoLogo.svg';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/cartContext';
import '../styles/navbar.css';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', email: '', role: 'customer' });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [location, setLocation] = useState(localStorage.getItem('location') || 'Select Location');
  const [locationSource, setLocationSource] = useState(localStorage.getItem('locationSource') || 'manual');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const locationPath = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    setIsLoggedIn(!!token);

    if (token && email) {
      const fetchUserDetails = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/profile/${email}`);
          setUserDetails({
            name: res.data.name || 'User',
            phone: res.data.phone || 'N/A',
            email: res.data.email || email,
            role: res.data.role || 'customer',
          });
        } catch (err) {
          console.error('Error fetching user details:', err);
        }
      };
      fetchUserDetails();
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customers`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const fetchCurrentLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const address = response.data.address;
        const city = address.city || address.town || address.village || 'Unknown City';
        const state = address.state || '';
        const newLocation = `${city}, ${state}`;
        setLocation(`Current Location: ${newLocation}`);
        setLocationSource('current');
        localStorage.setItem('location', `Current Location: ${newLocation}`);
        localStorage.setItem('locationSource', 'current');
      } catch (err) {
        console.error('Geolocation error:', err);
        setLocation('Select Location (Error)');
        setLocationSource('manual');
        localStorage.setItem('location', 'Select Location (Error)');
        localStorage.setItem('locationSource', 'manual');
      }
    } else {
      console.error('Geolocation not supported');
      setLocation('Select Location (Not Supported)');
      setLocationSource('manual');
      localStorage.setItem('location', 'Select Location (Not Supported)');
      localStorage.setItem('locationSource', 'manual');
    }
  };

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
    setShowLocationDropdown(false);
  };

  const goToLogin = () => {
    navigate('/Login');
    setShowDropdown(false);
  };

  const goToRegister = () => {
    navigate('/Register');
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserDetails({ name: '', phone: '', email: '', role: 'customer' });
    setShowDropdown(false);
    alert('Logged out successfully!');
    navigate('/');
  };

  const goToOrders = () => {
    navigate('/orders');
    setShowDropdown(false);
  };

  const goToVendorDashboard = () => {
    navigate('/VendorDashboard');
    setShowDropdown(false);
  };

  const redirectToHome = () => {
    navigate('/Home');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredProducts([]);
      setShowSearchDropdown(false);
      return;
    }
    const filtered = products.filter(
      (product) =>
        product?.ProductName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowSearchDropdown(true);
  };

  const handleProductClick = (ProductID) => {
    setSearchTerm('');
    setShowSearchDropdown(false);
    navigate(`/product/${ProductID}`);
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
    setShowDropdown(false);
  };

  const setManualLocation = (newLocation) => {
    setLocation(newLocation);
    setLocationSource('manual');
    localStorage.setItem('location', newLocation);
    localStorage.setItem('locationSource', 'manual');
    setShowLocationDropdown(false);
  };

  const handleCurrentLocation = () => {
    fetchCurrentLocation();
    setShowLocationDropdown(false);
  };

  const isVendorDashboard = locationPath.pathname === '/VendorDashboard';

  return (
    <div className="shadow-lg">
      <div className="container-fluid shadow-lg p-4">
        <div className="row align-items-center">
          {/* Logo Column */}
          <div className="col-4 col-lg-2 order-1">
            <img
              src={logo}
              alt="logo"
              width="120"
              onClick={redirectToHome}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* Location Column */}
          <div className="d-none d-lg-block col-lg-2 order-lg-2 position-relative">
            <div
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#007bff' }}
              onClick={toggleLocationDropdown}
            >
              <i className="fas fa-map-marker-alt me-2"></i>
              <span>{location}</span>
              <i className={`fas fa-caret-${showLocationDropdown ? 'up' : 'down'} ms-1`}></i>
            </div>
            {showLocationDropdown && (
              <div className="location-dropdown">
                <p onClick={handleCurrentLocation}>
                  <i className="fas fa-location-arrow me-2"></i>Current Location
                </p>
                <hr />
                <p onClick={() => setManualLocation('Bangalore, KA')}>
                  Bangalore, KA
                </p>
                <p onClick={() => setManualLocation('Mumbai, MH')}>
                  Mumbai, MH
                </p>
                <p onClick={() => setManualLocation('Delhi, DL')}>
                  Delhi, DL
                </p>
              </div>
            )}
          </div>

          {/* Search Column */}
          <div className="col-12 col-lg-6 order-3 order-lg-3 mt-2 mt-lg-0 position-relative">
            {!isVendorDashboard ? (
              <div className="search-container">
                <input
                  className="form-control"
                  placeholder="Search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {showSearchDropdown && (
                  <ul className="search-results">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <li
                          key={product._id}
                          className="search-result-item"
                          onClick={() => handleProductClick(product.ProductID)}
                        >
                          {product.ProductImage && (
                            <img
                              src={`data:image/jpeg;base64,${product.ProductImage}`}
                              alt={product.ProductName}
                              className="search-result-image"
                            />
                          )}
                          <div>
                            <p className="search-result-name">{product.ProductName}</p>
                            <p className="search-result-price">₹{product.ProductPrice}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="search-result-item">No products found</li>
                    )}
                  </ul>
                )}
              </div>
            ) : (
              <div style={{ height: "38px" }}></div>
            )}
          </div>

          {/* Profile Column */}
          <div className="col-4 col-lg-1 order-2 order-lg-4 position-relative text-end">
            {isLoggedIn ? (
              <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
                <i className="fas fa-user-circle fa-2x"></i>
                {showDropdown && (
                  <div className="user-dropdown">
                    <p className="mb-1"><strong>{userDetails.name}</strong></p>
                    <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>{userDetails.email}</p>
                    {userDetails.role === 'vendor' ? (
                      <p onClick={goToVendorDashboard}>Vendor Dashboard</p>
                    ) : (
                      <p onClick={goToOrders}>My Orders</p>
                    )}
                    <hr />
                    <p onClick={handleLogout}>Logout</p>
                  </div>
                )}
              </div>
            ) : (
              <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
                <i className="fas fa-user-circle fa-2x text-secondary"></i>
                {showDropdown && (
                  <div className="user-dropdown">
                    <p onClick={goToLogin}>Login</p>
                    <hr />
                    <p onClick={goToRegister}>Register</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Column */}
          <div className="col-4 col-lg-1 order-2 order-lg-5 position-relative text-end">
            <Link to="/cart" className="text-decoration-none text-dark" title="Go to Cart">
              <div className="position-relative">
                <i
                  className="fa fa-shopping-cart fa-2x"
                  aria-hidden="true"
                  style={{ cursor: 'pointer' }}
                ></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger cart-badge">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;