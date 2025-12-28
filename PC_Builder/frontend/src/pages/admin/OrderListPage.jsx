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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axiosClient.get('/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    return (
        <div className="admin-container">
            <h1 style={{ marginBottom: 20 }}>Quản lý Đơn hàng ({orders.length})</h1>

            {loading ? <p>Loading...</p> : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Thanh toán</th>
                            <th>Trạng thái</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id.substring(0, 10)}...</td>
                                <td>
                                    {order.user ? order.user.name : 'Khách vãng lai'}
                                    <br />
                                    <small style={{ color: '#888' }}>{order.user?.email}</small>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{formatPrice(order.totalPrice)}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    {order.isPaid ? (
                                        <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <FaCheck /> Đã trả
                                        </span>
                                    ) : (
                                        <span style={{ color: 'red', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <FaTimes /> Chưa trả
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <Link
                                        to={`/admin/order/${order._id}`}
                                        className="btn-add-product"
                                        style={{ padding: '5px 10px', fontSize: 12, width: 'fit-content', textDecoration: 'none' }}
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderListPage;