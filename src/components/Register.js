import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',  // Removed phone and OTP fields
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle final registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, role } = formData;

    try {
      // Proceed with registration after checking form values
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role
      });

      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed. Try again!');
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow register-card">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              name="name" 
              className="form-control" 
              placeholder="Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role selection */}
          <div className="mb-4">
            <select 
              name="role" 
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-success">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
