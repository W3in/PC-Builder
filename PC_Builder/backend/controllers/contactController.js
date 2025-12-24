const Contact = require('../models/Contact');

const sendContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newContact = await Contact.create({ name, email, subject, message });
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

module.exports = { sendContact };