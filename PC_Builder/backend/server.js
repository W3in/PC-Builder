const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const buildRoutes = require('./routes/buildRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const couponRoutes = require('./routes/couponRoutes');
const chatRoutes = require('./routes/chatRoutes');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

app.get('/', (req, res) => {
    res.json({ message: 'PC Builder API is running!' });
});

app.use('/api/products', productRoutes);
app.use('/api/build', buildRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/coupons', couponRoutes);
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});