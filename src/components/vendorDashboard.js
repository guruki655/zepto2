import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function VendorDashboard() {
    const [products, setProducts] = useState([]);
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/customers');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'ProductImage') {
            setFormData({ ...formData, ProductImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
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
            fetchProducts();
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
            ProductImage: null // Reset image to avoid issues with file input
        });
        setEditId(product._id);
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
                                value={formData.ProductPrice}
                                onChange={handleChange}
                            />
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
                        </div>
                        <div className="col-md-12">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                            >
                                {editId ? 'Update' : 'Add'} Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
        </div>
    );
}

export default VendorDashboard;