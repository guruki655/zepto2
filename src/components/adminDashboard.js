import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    vendorId: '',
    address: '',
    licenseNumber: '',
  });
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState(null); // 'user' or 'vendor'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Fetch User vendors (role: 'vendor')
      const userRes = await axios.get('http://localhost:5000/api/auth/users');
      const userVendors = userRes.data
        .filter(user => user.role === 'vendor')
        .map(user => ({ ...user, source: 'user' }));

      // Fetch Vendor collection vendors
      const vendorRes = await axios.get('http://localhost:5000/api/vendors');
      const vendorCollection = vendorRes.data.map(vendor => ({ ...vendor, source: 'vendor' }));

      // Combine and sort by name
      const combinedVendors = [...userVendors, ...vendorCollection].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setVendors(combinedVendors);
      setError('');
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError(error.response?.data?.message || 'Failed to fetch vendors');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editType === 'user') {
      // Update licenseNumber for User vendor
      if (!formData.licenseNumber) {
        setError('License number is required');
        return;
      }
      try {
        console.log('Updating user with data:', formData, 'and editId:', editId);
        const updateResponse = await axios.put(
          `http://localhost:5000/api/auth/users/${editId}`,
          { licenseNumber: formData.licenseNumber }
        );
        console.log('User updated:', updateResponse.data);
        alert('Vendor license number updated successfully!');
        setFormData({ name: '', vendorId: '', address: '', licenseNumber: '' });
        setEditId(null);
        setEditType(null);
        setError('');
        fetchVendors();
      } catch (error) {
        console.error('Error updating user:', error);
        setError(error.response?.data?.message || 'Failed to update vendor');
      }
    } else {
      // Add or update Vendor collection
      if (!formData.name || !formData.vendorId || !formData.address || !formData.licenseNumber) {
        setError('Please fill all fields');
        return;
      }
      try {
        console.log('Submitting vendor with data:', formData, 'and editId:', editId);
        if (editId) {
          const updateResponse = await axios.put(
            `http://localhost:5000/api/vendors/${editId}`,
            formData
          );
          console.log('Vendor updated:', updateResponse.data);
          alert('Vendor updated successfully!');
        } else {
          const createResponse = await axios.post('http://localhost:5000/api/vendors', formData);
          console.log('Vendor created:', createResponse.data);
          alert('Vendor added successfully!');
        }
        setFormData({ name: '', vendorId: '', address: '', licenseNumber: '' });
        setEditId(null);
        setEditType(null);
        setError('');
        fetchVendors();
      } catch (error) {
        console.error('Error submitting vendor:', error);
        setError(error.response?.data?.message || 'Failed to save vendor');
      }
    }
  };

  const handleDelete = async (id, source) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this vendor?');
    if (!confirmDelete) return;

    try {
      if (source === 'user') {
        // Optionally, restrict deletion of User vendors
        setError('Cannot delete registered vendors');
        return;
      }
      await axios.delete(`http://localhost:5000/api/vendors/${id}`);
      alert('Vendor deleted successfully!');
      setError('');
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      setError(error.response?.data?.message || 'Failed to delete vendor');
    }
  };

  const handleEdit = (vendor) => {
    setFormData({
      name: vendor.name || '',
      vendorId: vendor.vendorId || '',
      address: vendor.address?.addressLine1 || vendor.address || '',
      licenseNumber: vendor.licenseNumber || '',
    });
    setEditId(vendor._id);
    setEditType(vendor.source);
    setError('');
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <input
          name="name"
          placeholder="Vendor Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control mb-2"
          disabled={editType === 'user'}
        />
        <input
          name="vendorId"
          placeholder="Vendor ID"
          value={formData.vendorId}
          onChange={handleChange}
          className="form-control mb-2"
          disabled={editType === 'user'}
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="form-control mb-2"
          disabled={editType === 'user'}
        />
        <input
          name="licenseNumber"
          placeholder="License Number"
          value={formData.licenseNumber}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <button onClick={handleSubmit} className="btn btn-primary">
          {editType === 'user' ? 'Update License Number' : editId ? 'Update Vendor' : 'Add Vendor'}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Name</th>
              <th>Role/Source</th>
              <th>Vendor ID</th>
              <th>Email</th>
              <th>Address</th>
              <th>License Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={`${vendor._id}-${vendor.source}`}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.source === 'user' ? vendor.role : 'Vendor'}</td>
                <td>{vendor.vendorId || 'N/A'}</td>
                <td>{vendor.email || 'N/A'}</td>
                <td>
                  {vendor.source === 'user'
                    ? vendor.address?.addressLine1 || 'N/A'
                    : vendor.address || 'N/A'}
                </td>
                <td>{vendor.licenseNumber || 'N/A'}</td>
                <td>
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Update
                  </button>
                  {vendor.source === 'vendor' && (
                    <button
                      onClick={() => handleDelete(vendor._id, vendor.source)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;