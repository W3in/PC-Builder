const Product = require('../models/Product');

const getCompatibleComponents = async (req, res) => {
    try {

        console.log("------------------------------------------------");
        console.log("SERVER LOG: Nhận yêu cầu getCompatibleComponents");
        console.log("Body nhận được:", req.body);
        console.log("Query params:", req.query);

        const { selectedComponentId, targetCategory } = req.body;

        const sourceProduct = await Product.findById(selectedComponentId);

        if (!sourceProduct) {
            console.log("❌ LỖI: Không tìm thấy sản phẩm gốc ID:", selectedComponentId);
            return res.status(404).json({ message: "Không tìm thấy linh kiện gốc" });
        }

        console.log(`✅ Tìm thấy sản phẩm gốc: ${sourceProduct.name} (${sourceProduct.category})`);

        let filter = { category: targetCategory };

        if (sourceProduct.category === 'cpu' && targetCategory === 'mainboard') {
            const cpuSocket = sourceProduct.specs.get('socket');

            filter['specs.socket'] = cpuSocket;

            console.log(`Đang tìm Mainboard có socket: ${cpuSocket}`);
        }

        if (sourceProduct.category === 'mainboard' && targetCategory === 'ram') {
            const ramType = sourceProduct.specs.get('ram_type');
            filter['specs.type'] = ramType;
        }

        console.log("Final Filter Object:", JSON.stringify(filter, null, 2));

        const compatibleProducts = await Product.find(filter);

        console.log(`✅ Kết quả tìm thấy: ${compatibleProducts.length} sản phẩm.`);
        console.log("------------------------------------------------");

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