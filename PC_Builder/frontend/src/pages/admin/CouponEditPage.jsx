import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import '../../assets/styles/Admin.css';
import '../../assets/styles/CouponAdmin.css';

const CouponEditPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percent',
        discountValue: 0,
        maxDiscountAmount: 0,
        minOrderValue: 0,
        expirationDate: '',
        usageLimit: 100,
        isActive: true
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchCoupon = async () => {
                try {
                    const { data } = await axiosClient.get(`/coupons/${id}`);
                    const dateStr = data.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : '';

                    setFormData({
                        ...data,
                        expirationDate: dateStr
                    });
                } catch (error) {
                    toast.error("Không tìm thấy coupon");
                    navigate('/admin/coupons');
                }
            };
            fetchCoupon();
        }
    }, [id, isEditMode, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosClient.put(`/coupons/${id}`, formData);
                toast.success('Cập nhật mã thành công');
            } else {
                await axiosClient.post('/coupons', formData);
                toast.success('Tạo mã thành công');
            }
            navigate('/admin/coupons');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi lưu dữ liệu');
        }
    };

    return (
        <div className="product-edit-wrapper coupon-wrapper-limit">

            <div className="edit-header-box">
                <button onClick={() => navigate('/admin/coupons')} className="btn-back-admin">
                    <FaArrowLeft /> Quay lại
                </button>
                <h1 className="edit-title">{isEditMode ? `Sửa mã: ${formData.code}` : 'Tạo mã giảm giá mới'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="coupon-form-single">

                <div className="form-control">
                    <label className="form-label">Mã Code</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        placeholder="VD: SALE50"
                        disabled={isEditMode}
                    />
                </div>

                <div className="form-control">
                    <label className="form-label">Ngày hết hạn</label>
                    <input
                        type="date"
                        className="form-input"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        required
                    />
                </div>

                <div className="coupon-row-group">
                    <div className="form-control">
                        <label className="form-label">Loại giảm giá</label>
                        <select
                            className="form-select"
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                        >
                            <option value="percent">Theo phần trăm (%)</option>
                            <option value="fixed">Theo số tiền (VND)</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="form-label">Giá trị giảm</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                            required
                            placeholder="VD: 10 hoặc 50000"
                        />
                    </div>
                </div>

                {formData.discountType === 'percent' && (
                    <div className="form-control">
                        <label className="form-label">Giảm tối đa(VND)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.maxDiscountAmount}
                            onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                            placeholder="0 = Không giới hạn"
                        />
                        <small className="empty-text">Ví dụ: Giảm 10% nhưng tối đa chỉ 50k</small>
                    </div>
                )}

                <div className="coupon-row-group">
                    <div className="form-control">
                        <label className="form-label">Đơn tối thiểu (VND)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.minOrderValue}
                            onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="form-label">Số lượng mã</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-submit-coupon">
                    <FaSave style={{ marginRight: '8px' }} />
                    {isEditMode ? 'CẬP NHẬT' : 'TẠO MỚI'}
                </button>
            </form>
        </div>
    );
};

export default CouponEditPage;