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
        enum: ['cpu', 'mainboard', 'ram', 'hdd', 'storage', 'ssd', 'gpu', 'psu', 'case', 'cooler', 'monitor', 'prebuilt',
            'case_fans', 'thermal', 'sound_card', 'wired_net', 'wifi_net', 'headphones', 'keyboard', 'mouse', 'speakers',
            'webcam', 'antivirus', 'os'
        ]
    },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String },
    buildParts: [
        {
            component: { type: String },
            name: { type: String }
        }
    ],
    specs: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    usage: {
        type: String,
        enum: ['office', 'gaming', 'streaming', 'workstation'],
        default: 'gaming'
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;