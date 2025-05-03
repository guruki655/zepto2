import React, { useState, useEffect } from 'react';
import logo from '../images/zeptoLogo.svg';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/cartContext';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [location, setLocation] = useState('Select Location'); // Default location text
  const [showLocationDropdown, setShowLocationDropdown] = useState(false); // For manual selection
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers');
        console.log(res.data);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user's location using Geolocation API
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Use Nominatim API for reverse geocoding (free alternative to Google Maps)
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const address = response.data.address;
              const city = address.city || address.town || address.village || 'Unknown City';
              const state = address.state || '';
              setLocation(`${city}, ${state}`);
            } catch (err) {
              console.error('Error fetching address:', err);
              setLocation('Select Location (Error)');
            }
          },
          (err) => {
            console.error('Geolocation error:', err);
            setLocation('Select Location (Permission Denied)');
          }
        );
      } else {
        console.error('Geolocation not supported');
        setLocation('Select Location (Not Supported)');
      }
    };

    fetchLocation();
  }, []);

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
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
    setIsLoggedIn(false);
    setShowDropdown(false);
    alert('Logged out successfully!');
    navigate('/');
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

  // Toggle location dropdown for manual selection
  const toggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
  };

  // Manually set location (for demo purposes, replace with actual logic)
  const setManualLocation = (newLocation) => {
    setLocation(newLocation);
    setShowLocationDropdown(false);
  };

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
            <p
              style={{ cursor: 'pointer', color: '#007bff' }}
              onClick={toggleLocationDropdown}
            >
              {location}
            </p>
            {showLocationDropdown && (
              <div
                className="position-absolute bg-white shadow rounded p-2"
                style={{ top: '50px', left: '0', zIndex: 1000 }}
              >
                <p
                  style={{ cursor: 'pointer' }}
                  onClick={() => setManualLocation('Mumbai, MH')}
                >
                  Mumbai, MH
                </p>
                <p
                  style={{ cursor: 'pointer' }}
                  onClick={() => setManualLocation('Delhi, DL')}
                >
                  Delhi, DL
                </p>
                <p
                  style={{ cursor: 'pointer' }}
                  onClick={() => setManualLocation('Bangalore, KA')}
                >
                  Bangalore, KA
                </p>
              </div>
            )}
          </div>
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
                style={{ zIndex: 1000 }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <li
                      key={product._id}
                      className="p-2 border-bottom"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleProductClick(product.ProductID)}
                    >
                      {product.ProductName}
                    </li>
                  ))
                ) : (
                  <li className="p-2">No products found</li>
                )}
              </ul>
            )}
          </div>
          <div className="col-lg-1 position-relative">
            <i
              className="fa fa-user-circle-o fa-2x"
              aria-hidden="true"
              style={{ cursor: 'pointer' }}
              onClick={handleIconClick}
            ></i>
            {showDropdown && (
              <div
                className="position-absolute bg-white shadow rounded p-2"
                style={{ top: '50px', right: '0' }}
              >
                {isLoggedIn ? (
                  <p style={{ cursor: 'pointer' }} onClick={handleLogout}>
                    Logout
                  </p>
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