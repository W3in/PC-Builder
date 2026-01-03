import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient'; // Dùng axiosClient của bạn
import '../../assets/styles/Coupon.css';

const CouponSelector = ({ cartTotal, onApplyCoupon, show, onHide }) => {
    const { t } = useTranslation();
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        if (show) {
            const fetchCoupons = async () => {
                try {
                    const { data } = await axiosClient.get('/coupons/available');
                    setCoupons(data);
                } catch (error) {
                    console.error("Failed to fetch coupons");
                }
            };
            fetchCoupons();
        }
    }, [show]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header-custom">
                    <span>{t('coupon.title')}</span>
                    <button className="close-btn" onClick={onHide}>&times;</button>
                </div>

                <div className="modal-body-custom">
                    {coupons.map((coupon) => {
                        const isEligible = cartTotal >= coupon.minOrderValue;
                        return (
                            <div key={coupon._id} className={`coupon-card ${!isEligible ? 'disabled' : ''}`}>
                                <div className="coupon-left">
                                    <span className="coupon-icon">%</span>
                                </div>
                                <div className="coupon-content">
                                    <div className="coupon-code">{coupon.code}</div>
                                    <div className="coupon-desc">
                                        {coupon.discountType === 'percent'
                                            ? `${t('coupon.discount')} ${coupon.discountValue}%`
                                            : `${t('coupon.discount')} ${formatCurrency(coupon.discountValue)}`}
                                    </div>
                                    {coupon.maxDiscountAmount > 0 && coupon.discountType === 'percent' && (
                                        <div className="coupon-meta">{t('coupon.max_discount')}: {formatCurrency(coupon.maxDiscountAmount)}</div>
                                    )}
                                    <div className="coupon-meta">{t('coupon.min_order')}: {formatCurrency(coupon.minOrderValue)}</div>
                                </div>
                                <div className="coupon-action">
                                    {isEligible && (
                                        <button className="btn-apply-coupon" onClick={() => onApplyCoupon(coupon)}>
                                            {t('coupon.apply')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {coupons.length === 0 && <p className="text-center p-3">Không có mã nào khả dụng</p>}
                </div>
            </div>
        </div>
    );
};

export default CouponSelector;