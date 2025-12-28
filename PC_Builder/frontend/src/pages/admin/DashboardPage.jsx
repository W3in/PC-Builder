import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { formatPrice } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import '../../assets/styles/Admin.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage = () => {
    const { user } = useAuth();
    // Thay đổi state để lưu object thay vì mảng
    const [data, setData] = useState({
        monthlyStats: [],
        paymentStats: [],
        totalRevenue: 0,
        totalOrders: 0
    });
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axiosClient.get(`/orders/stats?year=${year}`, config);

                // Cập nhật state với dữ liệu mới từ Backend trả về
                setData(res.data);

            } catch (error) {
                console.error("Lỗi lấy thống kê", error);
            }
        };
        fetchStats();
    }, [user.token, year]);

    // Không cần tính totalRevenue thủ công nữa vì Backend đã tính rồi

    return (
        <div className="admin-container">
            <div className="admin-header-box">
                <h1>DASHBOARD TỔNG QUAN</h1>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 'bold' }}
                >
                    <option value="2024">Năm 2024</option>
                    <option value="2025">Năm 2025</option>
                    <option value="2026">Năm 2026</option>
                    <option value="2027">Năm 2027</option>
                    <option value="2028">Năm 2028</option>
                    <option value="2029">Năm 2029</option>
                </select>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <h3>Tổng doanh thu (Năm {year})</h3>
                    <div className="value stat-value-green">
                        {formatPrice(data.totalRevenue)}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Đơn hàng (Năm {year})</h3>
                    <div className="value">{data.totalOrders}</div>
                </div>
                <div className="stat-card">
                    <h3>Tổng đơn (Toàn thời gian)</h3>
                    <div className="value">{data.allTimeOrders || '--'}</div>
                </div>
                <div className="stat-card">
                    <h3>Khách hàng</h3>
                    <div className="value">{data.allTimeUsers || '--'}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                <div className="dashboard-chart-box">
                    <h3 style={{ marginBottom: 20 }}>Biểu đồ doanh thu từng tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatPrice(value)} />
                            <Bar dataKey="revenue" fill="#26a69a" name="Doanh thu" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="dashboard-chart-box">
                    <h3 style={{ marginBottom: 20 }}>Phương thức thanh toán</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.paymentStats}
                                cx="50%" cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {data.paymentStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;