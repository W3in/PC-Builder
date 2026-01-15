require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Checking API Key: ", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Dang thu ket noi den gemini-1.5-flash...");

        const result = await model.generateContent("Hello, are you working?");
        console.log("✅ KẾT NỐI THÀNH CÔNG! Model hoạt động tốt.");
        console.log("Phản hồi:", result.response.text());

    } catch (error) {
        console.error("❌ KẾT NỐI THẤT BẠI.");
        console.error("Chi tiết lỗi:", error.message);

        if (error.message.includes("404")) {
            console.log("\n⚠️ GỢI Ý: Model 'gemini-1.5-flash' không tìm thấy.");
            console.log("Hãy thử đổi sang model 'gemini-pro' (bản 1.0 cũ hơn) xem có chạy không.");
        }
    }
}

listModels();