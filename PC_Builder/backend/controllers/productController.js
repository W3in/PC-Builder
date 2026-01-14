const Product = require('../models/Product');
const User = require('../models/User');
const { indexProducts } = require('../services/vectorService');

const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        } : {};

        const query = { ...keyword };

        if (req.query.category) query.category = req.query.category;
        if (req.query.usage) query.usage = req.query.usage;

        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.brand) {
            query.brand = { $in: req.query.brand.split(',') };
        }

        const excludeFields = ['page', 'limit', 'keyword', 'category', 'brand', 'sort', 'minPrice', 'maxPrice', 'usage'];

        for (const key in req.query) {
            if (excludeFields.includes(key)) continue;

            const rawValue = req.query[key];
            if (!rawValue) continue;

            const valueArray = rawValue.split(',');

            const parsedValues = valueArray.map(val => {
                return !isNaN(val) ? Number(val) : val;
            });
            const queryKey = key.startsWith('specs.') ? key : `specs.${key}`;

            query[queryKey] = { $in: parsedValues };
        }

        const total = await Product.countDocuments(query);

        let sortOption = { createdAt: -1 };
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price_asc':
                    sortOption = { price: 1 };
                    break;
                case 'price_desc':
                    sortOption = { price: -1 };
                    break;
                case 'top_rated':
                    sortOption = { rating: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }

        const products = await Product.find(query)
            .limit(limit)
            .skip(skip)
            .sort(sortOption);

        res.json({
            products,
            page,
            pages: Math.ceil(total / limit),
            total
        });

    } catch (error) {
        console.error("Filter Error:", error);
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
        if (id) {
            const currentProduct = await Product.findById(id);
            if (currentProduct) {
                recommendedProducts = await Product.find({
                    category: currentProduct.category,
                    _id: { $ne: id }
                }).limit(8);
            }
        }

        else if (req.user) {
            const user = await User.findById(req.user._id).populate('favorites');
            if (user && user.favorites.length > 0) {
                const favCategories = [...new Set(user.favorites.map(p => p.category))];
                recommendedProducts = await Product.find({
                    category: { $in: favCategories },
                    _id: { $nin: user.favorites.map(p => p._id) }
                }).limit(8);
            }
        }

        if (recommendedProducts.length < 4) {
            const existingIds = recommendedProducts.map(p => p._id);
            const extraProducts = await Product.find({
                _id: { $nin: existingIds, $ne: id }
            })
                .sort({ createdAt: -1 })
                .limit(8 - recommendedProducts.length);

            recommendedProducts = [...recommendedProducts, ...extraProducts];
        }

        res.json(recommendedProducts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy gợi ý", error: error.message });
    }
};

const searchSuggestions = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const userId = req.user ? req.user._id : null;

        if (!keyword) {
            return res.json([]);
        }

        let products = await Product.find({
            name: { $regex: keyword, $options: 'i' }
        })
            .select('name image price slug category')
            .limit(20);

        if (userId && products.length > 0) {
            const user = await User.findById(userId).populate('favorites');

            if (user && user.favorites && user.favorites.length > 0) {
                const favoriteCategories = user.favorites.map(p => p.category);
                products.sort((a, b) => {
                    const aIsFav = favoriteCategories.includes(a.category);
                    const bIsFav = favoriteCategories.includes(b.category);
                    return (bIsFav === true) - (aIsFav === true);
                });
            } else {
                products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        } else {
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.json(products.slice(0, 8));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Search Error" });
    }
};

const reindexProducts = async (req, res) => {
    try {
        const products = await Product.find({}).lean();

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào để index' });
        }

        console.log(`Đang bắt đầu index ${products.length} sản phẩm...`);

        await indexProducts(products);

        res.status(200).json({
            success: true,
            message: `Đã nạp thành công ${products.length} sản phẩm vào bộ nhớ AI (Pinecone).`
        });

    } catch (error) {
        console.error('Lỗi khi Re-index:', error);
        res.status(500).json({
            message: 'Lỗi Server khi index dữ liệu',
            error: error.message
        });
    }
};
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRecommendations,
    searchSuggestions,
    reindexProducts
};