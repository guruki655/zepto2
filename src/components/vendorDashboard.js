import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        ProductSubType:'',
        ProductWeight: '',
        ProductShelf: '',
        ProductBrand: '',
        ProductMaterial: '',
        ProductImage: null
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
        if (e.target.name === 'ProductImage') {
            setFormData({ ...formData, ProductImage: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
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
                ProductImage: null, // reset image
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
        setFormData(product);
        setEditId(product._id);
    };


    return (
        <div>
            <h2>Vendor Dashboard</h2>

            <div className="mb-4">
                <input name="ProductID" placeholder="Product ID" value={formData.ProductID} onChange={handleChange} />
                <input name="ProductName" placeholder="Product Name" value={formData.ProductName} onChange={handleChange} />
                <input name="ProductDescription" placeholder="Description" value={formData.ProductDescription} onChange={handleChange} />
                <input name="ProductLocation" placeholder="Location" value={formData.ProductLocation} onChange={handleChange} />
                <input name="ProductPrice" placeholder="Price" value={formData.ProductPrice} onChange={handleChange} />
                <input name="ProductQuantity" placeholder="Quantity" value={formData.ProductQuantity} onChange={handleChange} />
                
                
                <select
  name="ProductType"
  value={formData.ProductType}
  onChange={handleChange}
>
  <option value="">Select Type</option>
  <option value="Cafe">Cafe</option>
  <option value="Toys">Toys</option>
  <option value="Electronics">Electronics</option>
  <option value="Mobile">Mobile</option>
  <option value="Jewellery">Jewellery</option>
  <option value="FrozenFood">FrozenFood</option>
  <option value="IceCream">IceCream</option>
  <option value="PackagedFood">PackagedFood</option>
  <option value="Skincare">Skincare</option>
  <option value="HairCare">HairCare</option>
  <option value="Baby">Baby</option>
</select>

<input name="ProductSubType" placeholder="SubType" value={formData.ProductSubType} onChange={handleChange} />


                <input name="ProductWeight" placeholder="Weight" value={formData.ProductWeight} onChange={handleChange} />
                <input name="ProductShelf" placeholder="Shelf" value={formData.ProductShelf} onChange={handleChange} />
                <input name="ProductBrand" placeholder="Brand" value={formData.ProductBrand} onChange={handleChange} />
                <input name="ProductMaterial" placeholder="Material" value={formData.ProductMaterial} onChange={handleChange} />
                <input 
    type="file" 
    name="ProductImage" 
    onChange={(e) => setFormData({ ...formData, ProductImage: e.target.files[0] })} 
/>                <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'} Product</button>
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
                                {product.ProductImage && (
  <img 
    src={`data:image/jpeg;base64,${product.ProductImage}`} 
    alt="Product" 
    style={{ width: '100px', height: '100px' }} 
  />
)}
                                <td>
                                    <button onClick={() => handleEdit(product)}>Update</button>
                                    <button onClick={() => handleDelete(product._id)}>Delete</button>
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
