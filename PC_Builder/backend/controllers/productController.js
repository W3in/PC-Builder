const Product = require('../models/Product');
const User = require('../models/User');

const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        } : {};
        const skip = (page - 1) * limit;

        const query = { ...keyword };

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.usage) {
            query.usage = req.query.usage;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.brand) {
            const brands = req.query.brand.split(',');
            query.brand = { $in: brands };
        }

        const excludeFields = ['page', 'limit', 'keyword', 'category', 'brand', 'sort', 'minPrice', 'maxPrice', 'usage'];
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
        const { name, price, image, brand, category, countInStock, description, specs, buildParts, usage } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc" });
        }

        const productExists = await Product.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (productExists) {
            return res.status(400).json({ message: "Sản phẩm này đã tồn tại trong hệ thống!" });
        }

        const generateSlug = (str) => {
            return str
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
        };

        const slug = generateSlug(name) + "-" + Date.now();

        console.log("Đang tạo sản phẩm:", { name, slug, category });

        const product = new Product({
            name,
            slug,
            price,
            user: req.user._id,
            image,
            brand,
            category,
            countInStock,
            description,
            specs,
            buildParts,
            usage
        });

        const createdProduct = await product.save();

        console.log("Tạo thành công:", createdProduct._id);
        res.status(201).json(createdProduct);

    } catch (error) {
        console.error("Lỗi tạo sản phẩm:", error);
        res.status(400).json({
            message: "Lỗi lưu dữ liệu",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock, specs, buildParts, usage } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
        product.specs = specs || product.specs;
        product.buildParts = buildParts || product.buildParts;
        product.usage = usage || product.usage;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Không thấy sản phẩm' });
    }
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        let recommendedProducts = [];

        // TRƯỜNG HỢP 1: Gợi ý sản phẩm tương tự (Detail Page)
        if (id) {
            const currentProduct = await Product.findById(id);
            if (currentProduct) {
                recommendedProducts = await Product.find({
                    category: currentProduct.category,
                    _id: { $ne: id } // Không hiện lại chính nó
                }).limit(8);
            }
        }

        // TRƯỜNG HỢP 2: Gợi ý cho người dùng (Homepage)
        else if (req.user) {
            const user = await User.findById(req.user._id).populate('favorites');
            if (user && user.favorites.length > 0) {
                const favCategories = [...new Set(user.favorites.map(p => p.category))];
                recommendedProducts = await Product.find({
                    category: { $in: favCategories },
                    _id: { $nin: user.favorites.map(p => p._id) } // Gợi ý món chưa thích
                }).limit(8);
            }
        }

        // TRƯỜNG HỢP 3: Mặc định (Nếu các trường hợp trên không đủ 4 sản phẩm)
        if (recommendedProducts.length < 4) {
            const existingIds = recommendedProducts.map(p => p._id);
            const extraProducts = await Product.find({
                _id: { $nin: existingIds, $ne: id }
            })
                .sort({ createdAt: -1 }) // Ưu tiên hàng mới về
                .limit(8 - recommendedProducts.length);

            recommendedProducts = [...recommendedProducts, ...extraProducts];
        }

        res.json(recommendedProducts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy gợi ý", error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRecommendations,
};