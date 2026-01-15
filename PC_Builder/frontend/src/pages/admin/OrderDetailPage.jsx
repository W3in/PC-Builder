import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import { FaArrowLeft, FaUser, FaBox, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/OrderAdmin.css';

const OrderDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await axiosClient.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải thông tin đơn hàng");
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, user.token]);

    const handleMarkAsPaid = async () => {
        if (window.confirm('Xác nhận đơn hàng này đã thu tiền?')) {
            try {
                await axiosClient.put(`/orders/${id}/pay`, {});

                toast.success("Đã cập nhật trạng thái thanh toán!");
                const { data } = await axiosClient.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
            }
        }
    };


    if (loading) return <div className="admin-container"><p>Đang tải đơn hàng...</p></div>;
    if (!order) return <div className="admin-container"><p>Không tìm thấy đơn hàng</p></div>;

    return (
        <div className="order-detail-wrapper">
            <div className="order-header-actions">
                <Link to="/admin/orders" className="btn-back">
                    <FaArrowLeft /> Quay lại danh sách
                </Link>
            </div>

            <h1 className="order-title">Chi tiết đơn hàng #{order._id}</h1>

            <div className="order-info-grid">
                <div className="order-card">
                    <h3 className="card-title"><FaUser /> Thông tin khách hàng</h3>
                    <div className="card-content">
                        <p><strong>Tên:</strong> {order.user?.name}</p>
                        <p><strong>Email:</strong> {order.user?.email}</p>
                        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                        <p><strong>Địa chỉ:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    </div>
                </div>

                <div className="order-card">
                    <h3 className="card-title"><FaCreditCard /> Thanh toán & Vận chuyển</h3>
                    <div className="card-content">
                        <p><strong>Phương thức:</strong> {order.paymentMethod?.toUpperCase()}</p>
                        <p>
                            <strong>Trạng thái:</strong>
                            {order.isPaid ? (
                                <span className="badge-paid">✅ Đã thanh toán ({new Date(order.paidAt).toLocaleDateString()})</span>
                            ) : (
                                <span className="badge-unpaid">❌ Chưa thanh toán</span>
                            )}
                        </p>
                    </div>

                    {!order.isPaid && (
                        <button onClick={handleMarkAsPaid} className="btn-confirm-pay">
                            XÁC NHẬN ĐÃ THU TIỀN
                        </button>
                    )}
                </div>
            </div>

            <div className="order-card">
                <h3 className="card-title"><FaBox /> Sản phẩm đã mua</h3>
                <div className="order-table-container">
                    <table className="order-items-table">
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
                                    <td className="product-item-cell">
                                        <img src={item.image} alt={item.name} className="product-img-mini" />
                                        <span>{item.name}</span>
                                    </td>
                                    <td>{formatPrice(item.price)}</td>
                                    <td>x {item.qty}</td>
                                    <td style={{ fontWeight: 'bold' }}>{formatPrice(item.price * item.qty)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="order-total-section">
                    <span className="total-label">Tổng giá trị đơn hàng:</span>
                    <span className="total-value">{formatPrice(order.totalPrice)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;