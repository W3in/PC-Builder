import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { formatPrice, getImageUrl } from '../utils/format';
import { useTranslation } from 'react-i18next';
import { FaUser, FaHistory, FaHeart, FaKey, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/product/FavoriteButton';
import '../assets/styles/Profile.css';

const ProfilePage = () => {
    const { t, i18n } = useTranslation();
    const { user, setUser, favorites } = useAuth();

    const [activeTab, setActiveTab] = useState('info');
    const [orders, setOrders] = useState([]);
    const [favProducts, setFavProducts] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch dữ liệu theo Tab
    useEffect(() => {
        if (!user?.token) return;

        if (activeTab === 'orders') {
            const fetchMyOrders = async () => {
                try {
                    const { data } = await axiosClient.get('/orders/myorders');
                    setOrders(data);
                    const total = data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
                    setTotalSpent(total);
                } catch (error) { console.error(error); }
            };
            fetchMyOrders();
        }

        if (activeTab === 'favorites') {
            const fetchFullFavs = async () => {
                try {
                    const { data } = await axiosClient.get('/users/favorites');
                    setFavProducts(data);
                } catch (error) { console.error(error); }
            };
            fetchFullFavs();
        }
    }, [activeTab, user?.token, favorites]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosClient.put('/users/profile', {
                name: formData.name, phone: formData.phone, address: formData.address
            });
            toast.success(t('toast.update_profile_success'));
            const updatedUser = { ...user, ...data };
            localStorage.setItem('pc_user', JSON.stringify(updatedUser));
            if (setUser) setUser(updatedUser);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error(t('toast.update_profile_failed'));
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error(t('toast.pwd_check_failed'));
        }
        try {
            const { data } = await axiosClient.put('/users/profile/password', {
                currentPassword: formData.currentPassword, newPassword: formData.newPassword
            });
            toast.success(t('toast.pwd_update_success'));
            if (data?.token) {
                const updatedUser = { ...user, ...data };
                localStorage.setItem('pc_user', JSON.stringify(updatedUser));
                if (setUser) setUser(updatedUser);
            }
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || t('toast.pwd_check_failed'));
        }
    };

    // Logic Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = favProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(favProducts.length / itemsPerPage);

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className={`profile-menu-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                    <FaUser /> {t('profile.my_account')}
                </div>
                <div className={`profile-menu-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <FaHistory /> {t('profile.order_history')}
                </div>
                <div className={`profile-menu-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => { setActiveTab('favorites'); setCurrentPage(1); }}>
                    <FaHeart /> {t('profile.favorites')}
                </div>
                <div className={`profile-menu-item ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                    <FaKey /> {t('profile.change_password')}
                </div>
            </div>

            <div className="profile-content">
                {activeTab === 'info' && (
                    <div className="tab-pane">
                        <div className="profile-header">
                            <h2>{t('profile.personal_info')}</h2>
                            <p>{t('profile.manage_security')}</p>
                        </div>
                        <form className="profile-form" onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>{t('profile.full_name')}</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t('profile.email_readonly')}</label>
                                <input type="email" value={user?.email} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>{t('profile.phone')}</label>
                                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t('profile.address')}</label>
                                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <button className="btn-buy-now">{t('profile.save_changes')}</button>
                        </form>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="tab-pane">
                        <div className="profile-header">
                            <h2>{t('profile.order_history')}</h2>
                            <p>{t('builder.total')}: <strong style={{ color: 'var(--accent-color)' }}>{formatPrice(totalSpent, i18n.language)}</strong></p>
                        </div>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>{t('profile.order_id')}</th>
                                    <th>{t('profile.date')}</th>
                                    <th>{t('builder.total')}</th>
                                    <th>{t('profile.pay')}</th>
                                    <th>{t('profile.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id.substring(0, 8)}...</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{formatPrice(order.totalPrice, i18n.language)}</td>
                                        <td>{order.paymentMethod === 'COD' ? t('cart.checkout_cod') : t('cart.checkout_online')}</td>
                                        <td>
                                            {order.isPaid ?
                                                <span className="status-badge status-paid">{t('profile.is_paid')}</span> :
                                                <span className="status-badge status-unpaid">{t('profile.not_paid')}</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && <p style={{ marginTop: 20 }}>{t('profile.no_orders')}</p>}
                    </div>
                )}

                {activeTab === 'favorites' && (
                    <div className="tab-pane">
                        <div className="profile-header">
                            <h2>{t('profile.favorites')}</h2>
                        </div>

                        <div className="favorites-kanban-grid">
                            {currentItems.map(product => (
                                <div key={product._id} className="fav-product-card">
                                    <FavoriteButton productId={product._id} />
                                    <div className="fav-card-img">
                                        <Link to={`/product/${product._id}`}>
                                            <img src={getImageUrl(product.image)} alt="" />
                                        </Link>
                                    </div>
                                    <div className="fav-card-body">
                                        <h4>{product.name}</h4>
                                        <div className="fav-card-price">
                                            {formatPrice(product.price, i18n.language)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-container">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                        onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0); }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}

                        {favProducts.length === 0 && <p>{t('profile.no_favorites')}</p>}
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="tab-pane">
                        <div className="profile-header">
                            <h2>{t('profile.change_password')}</h2>
                        </div>
                        <form className="profile-form" onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>{t('profile.current_password')}</label>
                                <input type="password" required value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t('profile.new_password')}</label>
                                <input type="password" required value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t('profile.confirm_new_password')}</label>
                                <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                            </div>
                            <button className="btn-buy-now">{t('profile.change_password')}</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;