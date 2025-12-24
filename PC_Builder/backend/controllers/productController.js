const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.brand) {
            const brands = req.query.brand.split(',');
            query.brand = { $in: brands };
        }

        const excludeFields = ['page', 'limit', 'keyword', 'category', 'brand', 'sort'];
        const queryObj = { ...req.query };

        excludeFields.forEach(el => delete queryObj[el]);

        for (const key in queryObj) {
            const values = queryObj[key].split(',');
            query[`specs.${key}`] = { $in: values };
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        res.json({
            products,
            page,
            pages: Math.ceil(total / limit),
            total
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, slug, price, image, brand, category, countInStock, description, specs } = req.body;

        const product = new Product({
            name, slug, price, image, brand, category, countInStock, description, specs
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: "Error create product", error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct
};