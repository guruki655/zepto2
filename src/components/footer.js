import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/footer.css'; 
import facebook from '../images/facebook1.svg'
import instagram from '../images/instagram1.svg'
import twitter from '../images/twitter1.svg'
import playstore from '../images/playstore1.svg'
import appstore from '../images/appstore1.svg'

function Footer() {
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL); // Debug log
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customers`);
        // Extract unique ProductType values
        const uniqueCategories = [...new Set(res.data.map((product) => product.ProductType))].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* Company Information */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3">Company</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
              <li><Link to="/careers" className="text-white text-decoration-none">Careers</Link></li>
              <li><Link to="/press" className="text-white text-decoration-none">Press</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3">Customer Support</h5>
            <ul className="list-unstyled">
              <li><Link to="/support" className="text-white text-decoration-none">Get Help</Link></li>
              <li><Link to="/delivery-areas" className="text-white text-decoration-none">Delivery Areas</Link></li>
              <li><Link to="/terms" className="text-white text-decoration-none">Terms of Use</Link></li>
              <li><Link to="/privacy" className="text-white text-decoration-none">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3">Shop by Category</h5>
            <ul className="list-unstyled">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/category/${category}`}
                      className="text-white text-decoration-none"
                    >
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Download App & Social Media */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3">Get the App</h5>
            <div className="mb-3">
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img
                  src={playstore}
                  alt="Google Play"
                  style={{ marginRight: '10px' }}
                />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img
                  src={appstore}
                  alt="App Store"
                />
              </a>
            </div>
            <h5 className="mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt='facebook logo'/>
              </a>
              <a href="https://instagram.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt='facebook logo'/>
              </a>
              {/* <a href="https://linkedin.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt='facebook logo'/>
              </a> */}
              <a href="https://x.com" className="text-white" target="_blank" rel="noopener noreferrer">
              <img src={twitter} alt='facebook logo'/>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Details */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="mb-0">
              Commodum Groceries Private Limited, Unit no 62, 6th floor, Der Deutsche Parkz, Subhash nagar road, near Nahur railway station, Nahur west, Mumbai - 400078
            </p>
            <p className="mb-0">support@yourapp.com | +91 9152341021</p>
            <p className="mb-0">© {new Date().getFullYear()} YourApp. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;