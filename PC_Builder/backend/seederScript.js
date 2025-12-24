require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Products = require('./seeds/products');

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);

        await Product.deleteMany({});
        await Product.insertMany(Products);

        console.log('✅ Data Imported Success!');
        process.exit();
    } catch (error) {
        console.error('❌ Error Import:', error);
        process.exit(1);
    }
};

importData();