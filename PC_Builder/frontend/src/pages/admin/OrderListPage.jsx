import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../assets/styles/Admin.css';

const OrderListPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get(`/orders?page=${page}&limit=20`);

            setOrders(data.orders);
            setPages(data.pages);
            setTotalOrders(data.total);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, user]);

    return (
        <div className="admin-container">
            <div className="product-list-header">
                <h1>Quản lý Đơn hàng <small style={{ fontSize: '0.5em', color: '#888' }}>({totalOrders} đơn)</small></h1>
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontWeight: 'bold' }}>#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                    <td>
                                        {order.user ? order.user.name : 'Khách vãng lai'}
                                        <br />
                                        <small style={{ color: '#888' }}>{order.user?.email}</small>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                                        {formatPrice(order.totalPrice)}
                                    </td>
                                    <td>
                                        <small className="badge-method">{order.paymentMethod}</small>
                                    </td>
                                    <td>
                                        {order.isPaid ? (
                                            <span style={{ color: '#27ae60', display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }}>
                                                <FaCheck /> Đã trả
                                            </span>
                                        ) : (
                                            <span style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }}>
                                                <FaTimes /> Chưa trả
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/admin/order/${order._id}`}
                                            className="btn-edit-small"
                                            title="Xem chi tiết"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pages > 1 && (
                        <div className="pagination">
                            {[...Array(pages).keys()].map((x) => (
                                <button
                                    key={x + 1}
                                    className={`page-btn ${x + 1 === page ? 'active' : ''}`}
                                    onClick={() => {
                                        setPage(x + 1);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    {x + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderListPage;