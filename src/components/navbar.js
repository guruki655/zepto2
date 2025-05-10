import React, { useState, useEffect } from 'react';
import logo from '../images/zeptoLogo.svg';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/cartContext';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', email: '' });
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
          const res = await axios.get(`http://localhost:5000/api/auth/profile/${email}`);
          setUserDetails({
            name: res.data.name || 'User',
            phone: res.data.phone || 'N/A',
            email: res.data.email || email
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
        const res = await axios.get('http://localhost:5000/api/customers');
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
    setUserDetails({ name: '', phone: '', email: '' });
    setShowDropdown(false);
    alert('Logged out successfully!');
    navigate('/');
  };

  const goToOrders = () => {
    navigate('/orders');
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
          <div className="col-lg-2">
            <img
              src={logo}
              alt="logo"
              width="120"
              onClick={redirectToHome}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="col-lg-2 position-relative">
            <div
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#007bff' }}
              onClick={toggleLocationDropdown}
            >
              <i className="fas fa-map-marker-alt me-2"></i>
              <span>{location}</span>
              <i className={`fas fa-caret-${showLocationDropdown ? 'up' : 'down'} ms-1`}></i>
            </div>
            {showLocationDropdown && (
              <div
                className="position-absolute bg-white shadow rounded p-2"
                style={{ top: '50px', left: '0', zIndex: 1000, minWidth: '200px' }}
              >
                <p
                  style={{ cursor: 'pointer', padding: '8px 12px', margin: 0, hover: { backgroundColor: '#f8f9fa' } }}
                  onClick={handleCurrentLocation}
                >
                  <i className="fas fa-location-arrow me-2"></i>Current Location
                </p>
                <hr style={{ margin: '4px 0' }} />
                <p
                  style={{ cursor: 'pointer', padding: '8px 12px', margin: 0 }}
                  onClick={() => setManualLocation('Bangalore, KA')}
                >
                  Bangalore, KA
                </p>
                <p
                  style={{ cursor: 'pointer', padding: '8px 12px', margin: 0 }}
                  onClick={() => setManualLocation('Mumbai, MH')}
                >
                  Mumbai, MH
                </p>
                <p
                  style={{ cursor: 'pointer', padding: '8px 12px', margin: 0 }}
                  onClick={() => setManualLocation('Delhi, DL')}
                >
                  Delhi, DL
                </p>
              </div>
            )}
          </div>
          {!isVendorDashboard && (
            <div className="col-lg-6 position-relative">
              <input
                className="form-control"
                placeholder="Search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {showSearchDropdown && (
                <ul
                  className="position-absolute bg-white border rounded mt-1 w-100"
                  style={{ zIndex: 1000, listStyleType: 'none', padding: 0 }}
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <li
                        key={product._id}
                        className="p-2 border-bottom d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleProductClick(product.ProductID)}
                      >
                        {product.ProductImage && (
                          <img
                            src={`data:image/jpeg;base64,${product.ProductImage}`}
                            alt={product.ProductName}
                            style={{ width: '30px', height: '30px', marginRight: '10px', objectFit: 'cover' }}
                          />
                        )}
                        <span>{product.ProductName}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-2">No products found</li>
                  )}
                </ul>
              )}
            </div>
          )}
          <div className="col-lg-1 position-relative">
            {isLoggedIn ? (
              <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={handleIconClick}
              >
                <span>Hello, {userDetails.name}</span>
                <i
                  className="fa fa-user-circle-o fa-2x"
                  aria-hidden="true"
                  style={{ marginLeft: '5px' }}
                ></i>
              </div>
            ) : (
              <i
                className="fa fa-user-circle-o fa-2x"
                aria-hidden="true"
                style={{ cursor: 'pointer' }}
                onClick={handleIconClick}
              ></i>
            )}
            {showDropdown && (
              <div
                className="position-absolute bg-white shadow rounded p-2"
                style={{ top: '50px', right: '0', zIndex: 1000 }}
              >
                {isLoggedIn ? (
                  <>
                    <p>{userDetails.phone}</p>
                    <p>{userDetails.email}</p>
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={goToOrders}
                    >
                      Orders
                    </p>
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ cursor: 'pointer' }} onClick={goToLogin}>
                      Login
                    </p>
                    <p style={{ cursor: 'pointer' }} onClick={goToRegister}>
                      Register
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="col-lg-1 position-relative">
            <Link to="/cart" className="text-decoration-none text-dark">
              <i
                className="fa fa-shopping-cart fa-2x"
                aria-hidden="true"
                style={{ cursor: 'pointer' }}
              ></i>
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;