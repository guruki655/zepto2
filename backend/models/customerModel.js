const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    ProductID: { type: String, required: true, unique:true },
    ProductName: { type: String, required: true },
    ProductDescription: { type: String, required: true },
    ProductLocation: { type: String, required: true },
    ProductPrice: { type: String, required: true },
    ProductQuantity: { type: String, required: true },
    ProductType: { type: String, required: true },
    ProductType: { type: String, required: true },
    ProductWeight: { type: String, required: true },
    ProductShelf: { type: String, required: true },
    ProductBrand: { type: String, required: true },
    ProductMaterial: { type: String, required: true },
    ProductImage: { type: String }
});

module.exports = mongoose.model('Customer', CustomerSchema);
