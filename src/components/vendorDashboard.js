import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function VendorDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showProducts, setShowProducts] = useState(false); // State to toggle products table
    const [showOrders, setShowOrders] = useState(false); // State to toggle orders table
    const [formData, setFormData] = useState({
        ProductID: '',
        ProductName: '',
        ProductDescription: '',
        ProductLocation: '',
        ProductPrice: '',
        ProductQuantity: '',
        ProductType: '',
        ProductSubType: '',
        ProductWeight: '',
        ProductShelf: '',
        ProductBrand: '',
        ProductMaterial: '',
        ProductImage: null,
        ProductRating: 1
    });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({ ProductPrice: '', ProductRating: '' });

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/customers');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/customers/orders/all');
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'ProductImage') {
            setFormData({ ...formData, ProductImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ProductPrice: '', ProductRating: '' };

        const price = parseFloat(formData.ProductPrice);
        if (isNaN(price) || price <= 0) {
            newErrors.ProductPrice = 'Price must be greater than 0';
            isValid = false;
        }

        const rating = parseInt(formData.ProductRating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            newErrors.ProductRating = 'Rating must be between 1 and 5';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const form = new FormData();
            for (let key in formData) {
                form.append(key, formData[key]);
            }

            if (editId) {
                await axios.put(`http://localhost:5000/api/customers/${editId}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setEditId(null);
            } else {
                await axios.post('http://localhost:5000/api/customers', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setFormData({
                ProductID: '',
                ProductName: '',
                ProductDescription: '',
                ProductLocation: '',
                ProductPrice: '',
                ProductQuantity: '',
                ProductType: '',
                ProductSubType: '',
                ProductWeight: '',
                ProductShelf: '',
                ProductBrand: '',
                ProductMaterial: '',
                ProductImage: null,
                ProductRating: 1
            });
            setErrors({ ProductPrice: '', ProductRating: '' });
            fetchProducts();
            setShowProducts(!showProducts); // Toggle products table
            setShowOrders(false); // Hide orders table
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/customers/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            ...product,
            ProductImage: null
        });
        setEditId(product._id);
        setErrors({ ProductPrice: '', ProductRating: '' });
    };

    const toggleOrderHistory = () => {
        setShowOrders(!showOrders); // Toggle orders table
        setShowProducts(false); // Hide products table
    };

    const toggleProducts = () => {
        setShowProducts(!showProducts); // Toggle products table
        setShowOrders(false); // Hide orders table
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">Vendor Dashboard</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductID"
                                placeholder="Product ID"
                                value={formData.ProductID}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductName"
                                placeholder="Product Name"
                                value={formData.ProductName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductDescription"
                                placeholder="Description"
                                value={formData.ProductDescription}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductLocation"
                                placeholder="Location"
                                value={formData.ProductLocation}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductPrice"
                                placeholder="Price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.ProductPrice}
                                onChange={handleChange}
                            />
                            {errors.ProductPrice && (
                                <small className="text-danger">{errors.ProductPrice}</small>
                            )}
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductQuantity"
                                placeholder="Quantity"
                                type="number"
                                value={formData.ProductQuantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                name="ProductType"
                                value={formData.ProductType}
                                onChange={handleChange}
                            >
                                <option value="">Select Type</option>
                                <option value="Cafe">Cafe</option>
                                <option value="Toys">Toys</option>
                                <option value="FruitsandVegetables">Fruits and Vegetables</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Makeup">Makeup</option>
                                <option value="Jewellery">Jewellery</option>
                                <option value="FrozenFood">FrozenFood</option>
                                <option value="IceCream">IceCream</option>
                                <option value="PackagedFood">PackagedFood</option>
                                <option value="Skincare">Skincare</option>
                                <option value="HairCare">HairCare</option>
                                <option value="Baby">Baby</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductSubType"
                                placeholder="SubType"
                                value={formData.ProductSubType}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductWeight"
                                placeholder="Weight"
                                value={formData.ProductWeight}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductShelf"
                                placeholder="Shelf"
                                value={formData.ProductShelf}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductBrand"
                                placeholder="Brand"
                                value={formData.ProductBrand}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductMaterial"
                                placeholder="Material"
                                value={formData.ProductMaterial}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                type="file"
                                name="ProductImage"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                name="ProductRating"
                                placeholder="Rating (1-5)"
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                value={formData.ProductRating}
                                onChange={handleChange}
                            />
                            {errors.ProductRating && (
                                <small className="text-danger">{errors.ProductRating}</small>
                            )}
                        </div>
                        <div className="col-md-12">
                            <button
                                className="btn btn-primary me-2"
                                onClick={handleSubmit}
                            >
                                {editId ? 'Update' : 'Add'} Product
                            </button>
                            <button
                                className="btn btn-primary me-2"
                                onClick={toggleOrderHistory}
                            >
                                {showOrders ? 'Hide' : 'See'} Order History
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={toggleProducts}
                            >
                                {showProducts ? 'Hide' : 'Show'} Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showProducts && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Type</th>
                                <th>SubType</th>
                                <th>Weight</th>
                                <th>Shelf</th>
                                <th>Brand</th>
                                <th>Material</th>
                                <th>Image</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>{product.ProductID}</td>
                                    <td>{product.ProductName}</td>
                                    <td>{product.ProductDescription}</td>
                                    <td>{product.ProductLocation}</td>
                                    <td>{product.ProductPrice}</td>
                                    <td>{product.ProductQuantity}</td>
                                    <td>{product.ProductType}</td>
                                    <td>{product.ProductSubType}</td>
                                    <td>{product.ProductWeight}</td>
                                    <td>{product.ProductShelf}</td>
                                    <td>{product.ProductBrand}</td>
                                    <td>{product.ProductMaterial}</td>
                                    <td>
                                        {product.ProductImage && (
                                            <img
                                                src={`data:image/jpeg;base64,${product.ProductImage}`}
                                                alt="Product"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {Array.from({ length: Math.floor(product.ProductRating) }, (_, i) => (
                                            <i key={i} className="fas fa-star text-warning" />
                                        ))}
                                        {Array.from({ length: 5 - Math.floor(product.ProductRating) }, (_, i) => (
                                            <i key={i + Math.floor(product.ProductRating)} className="far fa-star text-warning" />
                                        ))}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showOrders && (
                <>
                    <h3>All Customer Orders</h3>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sl No</th>
                                    <th>Order ID</th>
                                    <th>Customer Email</th>
                                    <th>Customer Name</th>
                                    <th>Total Amount</th>
                                    <th>Items</th>
                                    <th>Address</th>
                                    <th>Payment Status</th>
                                    <th>Order Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order._id}>
                                        <td>{index + 1}</td>
                                        <td>{order._id}</td>
                                        <td>{order.user?.email || 'N/A'}</td>
                                        <td>{order.user?.name || 'N/A'}</td>
                                        <td>₹{order.total.toFixed(2)}</td>
                                        <td>
                                            {order.items.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.ProductName} (Qty: {item.ProductQuantity}, Price: ₹{item.ProductPrice})
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {order.address?.addressLine1
                                                ? `${order.address.houseNo}, ${order.address.addressLine1}, ${order.address.building}`
                                                : 'N/A'}
                                        </td>
                                        <td>{order.paymentStatus}</td>
                                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default VendorDashboard;