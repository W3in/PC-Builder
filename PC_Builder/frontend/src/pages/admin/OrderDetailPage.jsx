import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import { FaArrowLeft, FaUser, FaBox, FaCreditCard } from 'react-icons/fa';
import '../../assets/styles/Admin.css';

const OrderDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axiosClient.get(`/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, user]);

    if (loading) return <div className="admin-container"><p>Đang tải đơn hàng...</p></div>;
    if (!order) return <div className="admin-container"><p>Không tìm thấy đơn hàng</p></div>;

    return (
        <div className="admin-container">
            <div style={{ marginBottom: 20 }}>
                <Link to="/admin/orders" className="btn-add-product" style={{ background: '#6c757d', width: 'fit-content' }}>
                    <FaArrowLeft /> Quay lại danh sách
                </Link>
            </div>

            <h1 style={{ marginBottom: 20, fontFamily: 'Chakra Petch' }}>
                Chi tiết đơn hàng #{order._id}
            </h1>

            <div className="edit-form-grid" style={{ marginBottom: 30 }}>
                <div className="dashboard-chart-box" style={{ height: 'auto' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaUser /> Thông tin khách hàng
                    </h3>
                    <p><strong>Tên:</strong> {order.user?.name}</p>
                    <p><strong>Email:</strong> <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a></p>
                    <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>

                <div className="dashboard-chart-box" style={{ height: 'auto' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaCreditCard /> Thanh toán & Vận chuyển
                    </h3>
                    <p>
                        <strong>Phương thức: </strong>
                        <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{order.paymentMethod}</span>
                    </p>
                    <p>
                        <strong>Trạng thái: </strong>
                        {order.isPaid ? (
                            <span style={{ color: 'green', fontWeight: 'bold' }}>Đã thanh toán ({new Date(order.paidAt).toLocaleDateString()})</span>
                        ) : (
                            <span style={{ color: 'red', fontWeight: 'bold' }}>Chưa thanh toán</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="dashboard-chart-box" style={{ height: 'auto' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaBox /> Sản phẩm đã mua
                </h3>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr key={index}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                    <img src={item.image} alt="" style={{ width: 50, height: 50, objectFit: 'contain', border: '1px solid #eee', borderRadius: 4 }} />
                                    <span>{item.name}</span>
                                </td>
                                <td>{formatPrice(item.price)}</td>
                                <td>x {item.qty}</td>
                                <td style={{ fontWeight: 'bold' }}>{formatPrice(item.price * item.qty)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ textAlign: 'right', marginTop: 20, fontSize: 20 }}>
                    Tổng cộng: <strong style={{ color: '#26a69a', fontSize: 28 }}>{formatPrice(order.totalPrice)}</strong>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;