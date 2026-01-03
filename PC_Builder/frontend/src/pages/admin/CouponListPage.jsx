import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/Admin.css';

const CouponListPage = () => {
    const { t, i18n } = useTranslation();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal xác nhận xóa
    const [showModal, setShowModal] = useState(false);
    const [targetId, setTargetId] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/coupons');
            setCoupons(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const openDeleteModal = (id) => {
        setTargetId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosClient.delete(`/coupons/${targetId}`);
            toast.success('Xóa mã giảm giá thành công');
            setShowModal(false);
            setTargetId(null);
            fetchCoupons();
        } catch (error) {
            toast.error("Lỗi khi xóa");
            setShowModal(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="product-list-header">
                <h1>{t('coupon.manage_title') || 'Quản lý Mã Giảm Giá'}</h1>
                <Link to="/admin/coupon/create" className="btn-add-product">
                    <FaPlus /> {t('coupon.create_new') || 'Thêm mã mới'}
                </Link>
            </div>

            {loading ? <p>Loading...</p> : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>{t('coupon.discount') || 'Giảm giá'}</th>
                            <th>{t('coupon.min_order') || 'Đơn tối thiểu'}</th>
                            <th>{t('coupon.usage_limit') || 'Lượt dùng'}</th>
                            <th>{t('coupon.expiry') || 'Hết hạn'}</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td style={{ fontWeight: 'bold', color: '#007bff' }}>{coupon.code}</td>

                                <td>
                                    {coupon.discountType === 'percent'
                                        ? `${coupon.discountValue}%`
                                        : formatPrice(coupon.discountValue, i18n.language)
                                    }
                                    {coupon.discountType === 'percent' && coupon.maxDiscountAmount > 0 && (
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            (Max: {formatPrice(coupon.maxDiscountAmount, i18n.language)})
                                        </div>
                                    )}
                                </td>

                                <td>{formatPrice(coupon.minOrderValue, i18n.language)}</td>

                                <td>
                                    {coupon.usedCount} / {coupon.usageLimit}
                                </td>

                                <td>{new Date(coupon.expirationDate).toLocaleDateString()}</td>

                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link to={`/admin/coupon/${coupon._id}/edit`} className="btn-edit-small">
                                            <FaEdit />
                                        </Link>
                                        <button className="btn-remove" onClick={() => openDeleteModal(coupon._id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Xác nhận xóa</h3>
                        <p>Bạn có chắc chắn muốn xóa mã này không?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                            <button className="btn-confirm-delete" onClick={handleConfirmDelete}>Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponListPage;