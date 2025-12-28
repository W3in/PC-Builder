import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { formatPrice } from '../utils/format';
import { useTranslation } from 'react-i18next';
import { FaUser, FaHistory, FaSignOutAlt, FaKey } from 'react-icons/fa';
import '../assets/styles/Profile.css';

const ProfilePage = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();

    const [activeTab, setActiveTab] = useState('info');
    const [orders, setOrders] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);

    // State cho form update
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchMyOrders();
        }
    }, [activeTab]);

    const fetchMyOrders = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axiosClient.get('/orders/myorders', config);
            setOrders(data);

            const total = data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
            setTotalSpent(total);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axiosClient.put('/users/profile', { name, phone, password }, config);
            setMessage("Cập nhật thành công!");
            // Cập nhật lại localStorage nếu cần thiết
        } catch (error) {
            setMessage("Cập nhật thất bại.");
        }
    };

    return (
        <div className="profile-container">
            {/* MENU BÊN TRÁI */}
            <div className="profile-sidebar">
                <div
                    className={`profile-menu-item ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    <FaUser /> Tài khoản của tôi
                </div>
                <div
                    className={`profile-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <FaHistory /> Lịch sử đơn hàng
                </div>
                <div className="profile-menu-item" onClick={logout} style={{ color: '#ff4d4d' }}>
                    <FaSignOutAlt /> Đăng xuất
                </div>
            </div>

            {/* NỘI DUNG BÊN PHẢI */}
            <div className="profile-content">

                {/* TAB 1: THÔNG TIN */}
                {activeTab === 'info' && (
                    <div className="tab-pane">
                        <div className="profile-header">
                            <h2>Hồ sơ cá nhân</h2>
                            <p>Quản lý thông tin bảo mật</p>
                        </div>
                        {message && <p style={{ color: 'green' }}>{message}</p>}

                        <form className="profile-form" onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Email (Không thể đổi)</label>
                                <input type="email" value={user?.email} disabled style={{ opacity: 0.7 }} />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Đổi mật khẩu mới (Bỏ trống nếu không đổi)</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                            </div>
                            <button className="btn-buy-now">Lưu thay đổi</button>
                        </form>
                    </div>
                )}

                {/* TAB 2: ĐƠN HÀNG */}
                {activeTab === 'orders' && (
                    <div className="tab-pane">
                        <div className="profile-header">
                            <h2>Lịch sử mua hàng</h2>
                            <p>Tổng tiền đã chi tiêu (Đã thanh toán): <strong style={{ color: 'var(--accent-color)', fontSize: '20px' }}>{formatPrice(totalSpent, i18n.language)}</strong></p>
                        </div>

                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id.substring(0, 8)}...</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{formatPrice(order.totalPrice, i18n.language)}</td>
                                        <td>{order.paymentMethod === 'COD' ? 'Khi nhận hàng' : 'Online (Visa)'}</td>
                                        <td>
                                            {order.isPaid ?
                                                <span className="status-badge status-paid">Đã thanh toán</span> :
                                                <span className="status-badge status-unpaid">Chưa thanh toán</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && <p style={{ marginTop: 20 }}>Bạn chưa có đơn hàng nào.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;