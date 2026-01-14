const { Pinecone } = require('@pinecone-database/pinecone');
const Groq = require("groq-sdk");
const { HfInference } = require("@huggingface/inference");

// Khởi tạo các dịch vụ
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const hf = new HfInference(process.env.HF_TOKEN);

const INDEX_NAME = 'pc-products'; // Đảm bảo Index này trên Pinecone có Dimension = 384

// Helper: Tạo Embedding dùng Hugging Face (Model: all-MiniLM-L6-v2)
async function createEmbedding(text) {
    try {
        const output = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text,
        });
        return output;
    } catch (error) {
        console.error("Lỗi tạo embedding HF:", error);
        throw error;
    }
}

// Helper: Dịch thuật dùng Groq (Model: Llama 3)
async function translateIfNeeded(text, lang) {
    if (lang === 'en') return text;
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a translator. Translate the following text to English, keeping technical terms intact. Return ONLY the translated text, no explanations."
                },
                { role: "user", content: text }
            ],
            model: "llama-3.1-8b-instant",
        });
        return completion.choices[0]?.message?.content || text;
    } catch (error) {
        console.error("Lỗi dịch thuật Groq:", error);
        return text;
    }
}

const indexProducts = async (products) => {
    const index = pinecone.index(INDEX_NAME);
    const vectors = await Promise.all(
        products.map(async (product) => {
            const textToEmbed = `
        Tên: ${product.name}
        Danh mục: ${product.category}
        Thương hiệu: ${product.brand}
        Giá: ${product.price} VNĐ
        Mô tả: ${product.description || ''}
      `.trim();

            const embedding = await createEmbedding(textToEmbed);

            return {
                id: product._id.toString(),
                values: embedding,
                metadata: {
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    brand: product.brand,
                    stock: product.countInStock,
                    image: product.image,
                    description: (product.description || '').substring(0, 500)
                }
            };
        })
    );

    // Pinecone batch upsert
    const BATCH_SIZE = 100;
    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
        const batch = vectors.slice(i, i + BATCH_SIZE);
        await index.upsert(batch);
    }
    console.log(`✅ Indexed ${vectors.length} products with Hugging Face`);
};

const searchProducts = async (query, lang = 'vi', topK = 5) => {
    const index = pinecone.index(INDEX_NAME);
    const translatedQuery = await translateIfNeeded(query, lang);
    const queryEmbedding = await createEmbedding(translatedQuery);

    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true
    });

    return results.matches.map(match => ({
        ...match.metadata,
        score: match.score,
        id: match.id
    }));
};

const handleReindex = async (req, res) => {
    try {
        const Product = require('../models/Product');
        const products = await Product.find({});
        await indexProducts(products);
        res.json({ success: true, count: products.length });
    } catch (error) {
        console.error('Reindex error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { indexProducts, searchProducts, handleReindex };