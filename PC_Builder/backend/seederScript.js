require('dotenv').config();
// Same Windows DNS fallback as server.js (querySrv ECONNREFUSED on some machines).
const dns = require('dns');
if (process.platform === 'win32' && dns.getServers().every(s => s.startsWith('127.') || s === '::1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Products = require('./seeds/products');
const Prebuilts = require('./seeds/prebuilts');

// Upsert by slug instead of deleteMany + insertMany. Wiping the collection also deleted every
// product created in the admin page (e.g. prebuilt PCs) and gave seed products new _ids, which
// broke favorites, old orders, saved carts and the Pinecone index that all point at those ids.
const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);

        const seedProducts = [...Products, ...Prebuilts];
        const result = await Product.bulkWrite(seedProducts.map((product) => ({
            updateOne: {
                filter: { slug: product.slug },
                update: { $set: product },
                upsert: true
            }
        })));

        const total = await Product.countDocuments();
        console.log(`✅ Seed done: ${result.upsertedCount} added, ${result.matchedCount} reset to seed values, ${total - seedProducts.length} admin-created products kept.`);
        process.exit();
    } catch (error) {
        console.error('❌ Error Import:', error);
        process.exit(1);
    }
};

importData();
