const Product = require('../models/Product');

const getCompatibleComponents = async (req, res) => {
    try {
        const { selectedComponentId, targetCategory } = req.body;

        const sourceProduct = await Product.findById(selectedComponentId);

        if (!sourceProduct) {
            return res.status(404).json({ message: "Không tìm thấy linh kiện gốc" });
        }

        let filter = { category: targetCategory };

        if (sourceProduct.category === 'cpu' && targetCategory === 'mainboard') {
            const cpuSocket = sourceProduct.specs.get('socket');

            filter['specs.socket'] = cpuSocket;
        }

        if (sourceProduct.category === 'mainboard' && targetCategory === 'ram') {
            const ramType = sourceProduct.specs.get('ram_type');
            filter['specs.type'] = ramType;
        }
        const compatibleProducts = await Product.find(filter);
        res.json({
            message: "Success",
            count: compatibleProducts.length,
            products: compatibleProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Build PC" });
    }
};

module.exports = { getCompatibleComponents };