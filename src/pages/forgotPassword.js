import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Verify OTP, 3: Reset password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [resetToken, setResetToken] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) return;

    try {
      console.log('Sending OTP to:', `${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`); // Debug log
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`, {
        email: formData.email,
      });
      alert(response.data.message);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    try {
      console.log('Verifying OTP at:', `${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp-reset`); // Debug log
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp-reset`, {
        email: formData.email,
        otp: formData.otp,
      });
      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setStep(3); // Move to reset password step
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  const handleResetPassword = async () => {
    if (!formData.newPassword) {
      setErrors({ newPassword: 'New password is required' });
      return;
    }

    try {
      console.log('Resetting password at:', `${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`); // Debug log
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, {
        resetToken,
        newPassword: formData.newPassword,
      });
      alert(response.data.message);
      navigate('/login'); // Redirect to login after success
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="forgot-password-container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow forgot-password-card">
        <h2 className="text-center mb-4">Forgot Password</h2>

        {step === 1 && (
          <div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <button className="btn btn-primary w-100" onClick={handleSendOTP}>
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-3">
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
            <button className="btn btn-success w-100" onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-3">
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              {errors.newPassword && <small className="text-danger">{errors.newPassword}</small>}
            </div>
            <button className="btn btn-success w-100" onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;