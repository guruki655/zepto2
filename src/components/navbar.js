import React, { useState, useEffect } from 'react';
import logo from '../images/zeptoLogo.svg';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);  // If token exists, logged in
  }, []);

  const handleIconClick = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown
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
    localStorage.removeItem('token'); // Remove token
    setIsLoggedIn(false);
    setShowDropdown(false);
    alert('Logged out successfully!');
    navigate('/'); // Back to home
  };

  function redirectToHome(){
    navigate('/Home')




    
  }
  

  return (
    <div className='shadow-lg'>
      <div className='container-fluid shadow-lg p-4'>
        <div className='row align-items-center'>
          <div className='col-lg-2'>
            <img src={logo} alt='logo' width="120" onClick={redirectToHome} />
          </div>
          <div className='col-lg-2'>
            <p>Location</p>
          </div>
          <div className='col-lg-6'>
            <input className='form-control' placeholder='Search' type='text' />
          </div>
          <div className='col-lg-1 position-relative'>
            <i 
              className="fa fa-user-circle-o fa-2x" 
              aria-hidden="true" 
              style={{ cursor: 'pointer' }}
              onClick={handleIconClick}
            ></i>

            {/* Dropdown */}
            {showDropdown && (
              <div className="position-absolute bg-white shadow rounded p-2" style={{ top: '50px', right: '0' }}>
                {isLoggedIn ? (
                  <p style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</p>
                ) : (
                  <>
                    <p style={{ cursor: 'pointer' }} onClick={goToLogin}>Login</p>
                    <p style={{ cursor: 'pointer' }} onClick={goToRegister}>Register</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className='col-lg-1'>
            Cart
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
