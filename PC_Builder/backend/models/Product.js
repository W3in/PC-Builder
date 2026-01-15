const mongoose = require('mongoose');

const specsSchema = new mongoose.Schema({
    // --- THÔNG SỐ CHUNG (General) ---
    brand: { type: String },
    model: { type: String },
    color: { type: String },
    warranty: { type: String },

    // --- HIỆU NĂNG & ĐIỆN NĂNG---
    tdp: { type: Number },
    performance_score: { type: Number, default: 0 },

    // --- KÍCH THƯỚC & KẾT NỐI---
    size: { type: String },
    weight: { type: String },
    connectivity: { type: String },
    interface: { type: String },

    // --- CPU & MAINBOARD & COOLER ---
    socket: { type: String },
    chipset: { type: String },
    series: { type: String },
    core_count: { type: Number },
    thread_count: { type: Number },
    base_clock: { type: Number },
    boost_clock: { type: Number },
    integrated_graphics: { type: Boolean, default: false },
    max_ram_capacity: { type: Number },
    ram_type: { type: String },

    // --- RAM & STORAGE ---
    type: { type: String },
    capacity: { type: Number },
    speed: { type: Number },
    kit: { type: String },
    cas_latency: { type: Number },
    interface: { type: String },

    // --- GPU (VGA) ---
    vram: { type: Number },
    length: { type: Number },
    recommended_psu: { type: Number },
    series: { type: String },

    // --- PSU (Nguồn) ---
    wattage: { type: Number },
    efficiency: { type: String },
    modular: { type: String },

    // --- CASE---
    form_factor: { type: String },
    supported_motherboards: [{ type: String }],
    max_gpu_length: { type: Number },
    max_cpu_cooler_height: { type: Number },

    // --- MONITOR---
    screen_size: { type: Number },
    resolution: { type: String },
    refresh_rate: { type: Number },
    panel_type: { type: String },

    // --- MẠNG---
    standard: { type: String },
    bluetooth: { type: String },

    // --- PHẦN MỀM---
    edition: { type: String },
    version: { type: String },
    license: { type: String },
    format: { type: String },

    // --- BÀN PHÍM---
    switch_type: { type: String },
    layout: { type: String },
    led: { type: String },

    // --- CHUỘT---
    sensor: { type: String },
    handedness: { type: String },
    dpi: { type: String },

    // --- TAI NGHE---
    surround_sound: { type: String },
    feature: { type: String },
    battery: { type: String },

    // --- KEO TẢN NHIỆT ---
    conductivity: { type: String },
}, { _id: false });

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
        type: specsSchema,
        default: {}
    },
    usage: {
        type: String,
        enum: ['office', 'gaming', 'streaming', 'workstation'],
        default: 'gaming'
    },
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;