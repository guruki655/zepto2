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

    // Fetch vendors
    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            // const res = await axios.get('http://localhost:5000/api/vendors');
            const res=await axios.get('http://localhost:5000/api/auth/users')
            setVendors(res.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // Validation: check if any field is empty
        if (!formData.name || !formData.vendorId || !formData.address || !formData.licenseNumber) {
            alert('Please fill all fields');
            return;
        }

        try {
            console.log('Submitting form with data:', formData, 'and editId:', editId);
            if (editId) {
                const updateResponse = await axios.put(`http://localhost:5000/api/vendors/${editId}`, formData);
                console.log('Vendor updated:', updateResponse.data);
                alert('Vendor updated successfully!');
                setEditId(null);
            } else {
                const createResponse = await axios.post('http://localhost:5000/api/vendors', formData);
                console.log('Vendor created:', createResponse.data);
                alert('Vendor added successfully!');
            }
            setFormData({ name: '', vendorId: '', address: '', licenseNumber: '' });
            fetchVendors();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this vendor?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/vendors/${id}`);
            alert('Vendor deleted successfully!');
            fetchVendors();
        } catch (error) {
            console.error('Error deleting vendor:', error);
        }
    };

    const handleEdit = (vendor) => {
        // Only pick needed fields
        setFormData({
            name: vendor.name || '',
            vendorId: vendor.vendorId || '',
            address: vendor.address || '',
            licenseNumber: vendor.licenseNumber || '',
        });
        setEditId(vendor._id);
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <div className="mb-4">
                <input
                    name="name"
                    placeholder="Vendor Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    name="vendorId"
                    placeholder="Vendor ID"
                    value={formData.vendorId}
                    onChange={handleChange}
                />
                <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                />
                <input
                    name="licenseNumber"
                    placeholder="License No"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>
                    {editId ? 'Update Vendor' : 'Add Vendor'}
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th> Name</th>
                            <th>Role</th>
                            <th>Vendor ID</th>
                            <th>Customer ID </th>
                            <th>Email</th>
                            {/* <th>Vendor Address</th> */}
                            <th>Vendor License Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td>{vendor.name}</td>
                                <td>{vendor.role}</td>
                                <td>{vendor.vendorId?vendor.vendorId:'NA'}</td>                                {/* <td>{vendor.address}</td> */}
                                <td>{vendor.customerId?vendor.customerId:'NA'}</td>                                {/* <td>{vendor.address}</td> */}
                                <td>{vendor.email}</td>
                                <td>{vendor.licenseNumber}</td>
                                <td>
                                    <button onClick={() => handleEdit(vendor)}>Update</button>
                                    <button onClick={() => handleDelete(vendor._id)}>Delete</button>
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
