import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    otp: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    otp: ''
  });

  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (isOTPVerified) {
      if (!formData.name) {
        newErrors.name = 'Name is required.';
        isValid = false;
      }
      if (!formData.email) {
        newErrors.email = 'Email is required.';
        isValid = false;
      }
      if (!formData.password) {
        newErrors.password = 'Password is required.';
        isValid = false;
      }
      if (!formData.role) {
        newErrors.role = 'Role is required.';
        isValid = false;
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required.';
        isValid = false;
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits and start with 6-9.';
        isValid = false;
      }
      if (!formData.otp) {
        newErrors.otp = 'OTP is required.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOTP = async (isResend = false) => {
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      alert('Enter a valid 10-digit phone number starting with 6-9.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', { phone: formData.phone });
      alert(isResend ? 'OTP resent successfully!' : 'OTP sent successfully!');
      setFormData({ ...formData, otp: '' }); // Clear previous OTP input
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === 'Phone number already registered') {
        alert('Phone number already registered!');
      } else {
        alert('Failed to send OTP!');
      }
    }
  };

  const handleResendOTP = () => {
    handleSendOTP(true); // Call send OTP with resend flag
  };

  const handleOTPValidation = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        phone: formData.phone,
        otp: formData.otp
      });

      if (response.data.success) {
        setIsOTPVerified(true);
        alert('OTP verified successfully!');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      alert('Error verifying OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { name, email, password, role, phone } = formData;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
        phone
      });

      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed. Try again!');
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow register-card">
        <h2 className="text-center mb-4">Register</h2>

        {!isOTPVerified ? (
          <div>
            <div className="mb-3">
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>
            <button type="button" className="btn btn-primary w-100 mb-2" onClick={handleSendOTP}>
              Send OTP
            </button>

            <div className="mb-3 mt-3">
              <input
                type="text"
                name="otp"
                className="form-control"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              {errors.otp && <small className="text-danger">{errors.otp}</small>}
            </div>
            <button type="button" className="btn btn-success w-100 mb-2" onClick={handleOTPValidation}>
              Verify OTP
            </button>
            <button type="button" className="btn btn-secondary w-100" onClick={handleResendOTP}>
              Resend OTP
            </button>
          </div>
        ) : (
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
              {errors.name && <small className="text-danger">{errors.name}</small>}
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
              {errors.email && <small className="text-danger">{errors.email}</small>}
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
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
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
              {errors.role && <small className="text-danger">{errors.role}</small>}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                readOnly
                disabled
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">Register</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;