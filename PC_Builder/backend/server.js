// 1. Import các packages đã cài
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 2. Tạo Express app
const productRoutes = require('./routes/productRoutes');
const buildRoutes = require('./routes/buildRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();

// 3. Middleware 
app.use(cors());
app.use(express.json());

// 4. Kết nối MongoDB
mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// 5. Test route 
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

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

// 6. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});