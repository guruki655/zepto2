import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Response data:', res.data);

      if (!res.data.email) {
        throw new Error('Email not received from server');
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      console.log('Email in localStorage:', localStorage.getItem('email'));

      alert('Login successful!');

      if (res.data.role === 'customer') {
        window.location.href = '/';
      } else if (res.data.role === 'admin') {
        window.location.href = '/AdminDashboard';
      } else {
        window.location.href = '/VendorDashboard';
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      alert('Enter valid details');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow login-card" style={{ width: '350px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </button>
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
          <div className="text-center mt-3">
            <a href="/ForgotPassword" className="text-primary">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;