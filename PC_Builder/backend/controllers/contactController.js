const Contact = require('../models/Contact');

const sendContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const fields = [name, email, subject, message];
        if (fields.some(f => typeof f !== 'string' || !f.trim()) || message.length > 5000 || (name + email + subject).length > 500) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
        const newContact = await Contact.create({ name, email, subject, message });
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

module.exports = { sendContact };