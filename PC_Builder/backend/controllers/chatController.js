const Groq = require("groq-sdk");
const { searchProducts } = require("../services/vectorService");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const conversations = new Map();

const EXCHANGE_RATES = {
    vi: 1,
    en: 0.00004,
    ja: 0.006
};

const CURRENCY_CONFIG = {
    vi: { locale: 'vi-VN', currency: 'VND' },
    en: { locale: 'en-US', currency: 'USD' },
    ja: { locale: 'ja-JP', currency: 'JPY' }
};

const formatPriceServer = (amountInVND, lang) => {
    if (!amountInVND) amountInVND = 0;
    const rate = EXCHANGE_RATES[lang] || 1;
    const convertedAmount = amountInVND * rate;
    const config = CURRENCY_CONFIG[lang] || CURRENCY_CONFIG.vi;

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: 0
    }).format(convertedAmount);
};

const handleChatMessage = async (req, res) => {
    try {
        const { message, lang = 'vi', sessionId, aiConfig } = req.body;

        if (!message) return res.status(400).json({ error: "Vui lòng nhập tin nhắn" });

        const config = aiConfig || {
            sys_prompt: "Bạn là nhân viên tư vấn bán PC chuyên nghiệp.",
            label_id: "Mã", label_name: "Tên", label_price: "Giá",
            label_status: "Tình trạng", in_stock: "Còn hàng", out_stock: "Hết",
            label_desc: "Mô tả", currency: "VNĐ", error_msg: "Lỗi kết nối"
        };

        const relevantProducts = await searchProducts(message, lang, 4);

        const productContext = relevantProducts.map(p => `
          - ${config.label_id}: ${p.id}
          - ${config.label_name}: ${p.name}
          - ${config.label_price}: ${formatPriceServer(p.price, lang)}
          - ${config.label_status}: ${p.stock > 0 ? config.in_stock : config.out_stock}
          - ${config.label_desc}: ${p.description}
        `).join("\n");

        const history = conversations.get(sessionId) || [];
        const messagesForGroq = history.map(h => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.content
        }));

        const systemPromptContent = `
        ${config.sys_prompt}

        NHIỆM VỤ CỦA BẠN:
        Dựa vào [DANH SÁCH SẢN PHẨM] bên dưới, hãy trả lời khách hàng.

        QUY TẮC QUAN TRỌNG (BẮT BUỘC TUÂN THỦ):
        1. Nếu khách muốn MUA một sản phẩm cụ thể có trong danh sách:
           - Trả về "action": "add_to_cart".
           - Điền đúng "productId" và "productName".
           - "reply": Thông báo đã thêm vào giỏ hàng (bằng ngôn ngữ ${lang}).
        2. Nếu khách chỉ hỏi tư vấn hoặc trò chuyện:
           - Trả về "action": "chat".
           - "reply": Câu trả lời tư vấn của bạn (bằng ngôn ngữ ${lang}).
        3. Tuyệt đối KHÔNG bịa đặt thông tin sản phẩm không có trong danh sách. Nếu không tìm thấy, hãy xin lỗi và bảo không có.

        YÊU CẦU ĐỊNH DẠNG OUTPUT (JSON Only):
        Bạn chỉ được trả về 1 JSON object duy nhất, không có text thừa.
        {
          "action": "chat" | "add_to_cart",
          "productId": "string (hoặc null)",
          "productName": "string (hoặc null)",
          "reply": "string"
        }

        [DANH SÁCH SẢN PHẨM TỪ KHO]:
        ${productContext}
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPromptContent },
                ...messagesForGroq,
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const responseText = completion.choices[0]?.message?.content;
        let aiResponse;

        try {
            aiResponse = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            aiResponse = { action: "chat", reply: config.error_msg };
        }

        history.push({ role: "user", content: message });
        history.push({ role: "model", content: aiResponse.reply });

        if (history.length > 20) history.splice(0, history.length - 20);
        conversations.set(sessionId, history);

        res.json({
            ...aiResponse,
            suggestedProducts: relevantProducts
        });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ action: "chat", reply: "Server Error" });
    }
};

const clearConversation = (sessionId) => {
    conversations.delete(sessionId);
};

module.exports = { handleChatMessage, clearConversation };