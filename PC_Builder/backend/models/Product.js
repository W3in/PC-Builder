const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['cpu', 'mainboard', 'ram', 'hdd', 'storage', 'ssd', 'gpu', 'psu', 'case', 'cooler', 'monitor']
    },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String },

    specs: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;