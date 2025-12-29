const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Hàm tạo Token (Hết hạn sau 30 ngày)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// 1. Đăng ký (Register)
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "Email này đã được sử dụng" });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// 2. Đăng nhập (Login)
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Sai email hoặc mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

const googleLogin = async (req, res) => {
    const { googleToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name: name,
                email: email,
                password: randomPassword,
                phone: ""
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: "Google Token không hợp lệ", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const isMatch = await user.matchPassword(currentPassword);

            if (!isMatch) {
                return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác" });
            }

            user.password = newPassword;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                message: "Đổi mật khẩu thành công"
            });
        } else {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');

        if (user) {
            res.json(user.favorites || []);
        } else {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

const getFavoriteIds = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.favorites || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleFavorite = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const isFavorite = user.favorites.includes(productId);
    if (isFavorite) {
        user.favorites = user.favorites.filter(id => id.toString() !== productId);
    } else {
        user.favorites.push(productId);
    }

    await user.save();
    res.json({ favorites: user.favorites });
};

const removeFavorite = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.json(user.favorites);
};


module.exports = { registerUser, authUser, googleLogin, updateUserProfile, updateUserPassword, getFavorites, getFavoriteIds, toggleFavorite, removeFavorite };