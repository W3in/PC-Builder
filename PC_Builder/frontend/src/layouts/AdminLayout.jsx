import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaChartBar, FaBoxOpen, FaClipboardList, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/Admin.css'; // Sẽ tạo css sau

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-wrapper">
            {/* SIDEBAR BÊN TRÁI */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>ADMIN CP</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-link">
                        <FaChartBar /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="admin-link">
                        <FaBoxOpen /> Quản lý Sản phẩm
                    </Link>
                    <Link to="/admin/orders" className="admin-link">
                        <FaClipboardList /> Quản lý Đơn hàng
                    </Link>
                    <Link to="/" className="admin-link">
                        <FaHome /> Về trang chủ
                    </Link>
                </nav>
                <button onClick={handleLogout} className="admin-logout">
                    <FaSignOutAlt /> Đăng xuất
                </button>
            </aside>

            {/* NỘI DUNG BÊN PHẢI */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;