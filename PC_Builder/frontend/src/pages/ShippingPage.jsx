import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice, getImageUrl } from '../utils/format';
import { FaCreditCard, FaTruck, FaChevronLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CouponSelector from '../components/common/CouponSelector';
import axiosClient from '../api/axiosClient';
import '../assets/styles/Shipping.css';

const ShippingPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { cartItems, finalTotal, subTotal, applyCoupon, appliedCoupon, discountAmount, clearCart } = useCart();

    const [showCouponModal, setShowCouponModal] = useState(false);


    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: ''
    });

    const handleInputChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleSelectCoupon = (coupon) => {
        const result = applyCoupon(coupon);

        if (result.success) {
            setShowCouponModal(false);
            toast.success(result.msg);
        } else {
            toast.error(result.msg);
        }
    };

    const validateForm = () => {
        const { fullName, email, phone, address } = shippingInfo;
        if (!fullName || !email || !phone || !address) {
            toast.error(t('toast.form_shipping_incomplete'));
            return false;
        }
        return true;
    };

    const handlePayment = async (method) => {
        if (!validateForm()) return;

        localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo));

        if (method === 'stripe') {
            navigate('/payment');
        } else {
            try {
                const orderData = {
                    orderItems: cartItems,
                    shippingAddress: shippingInfo,
                    paymentMethod: 'COD',
                    itemsPrice: subTotal,
                    discountAmount: discountAmount,
                    totalPrice: finalTotal,
                    couponCode: appliedCoupon ? appliedCoupon.code : null,
                    isPaid: false,
                };

                const { data } = await axiosClient.post('/orders', orderData);

                if (data) {
                    clearCart();
                    localStorage.removeItem('shippingAddress');

                    navigate("/order-success");
                }
            } catch (error) {
                console.error("Lỗi đặt hàng COD:", error);
                toast.error(error.response?.data?.message || `${t('payment.error')}`);
            }
        }
    };

    return (
        <div className="shipping-wrapper">
            <div className="shipping-left">
                <div className="shipping-form-section">
                    <h2 className="shipping-title">{t('cart.shipping_info')}</h2>

                    <div className="form-group">
                        <label>{t('cart.full_name')}</label>
                        <input
                            type="text" name="fullName" className="form-input"
                            placeholder={t('cart.full_name')} value={shippingInfo.fullName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('cart.email')}</label>
                            <input
                                type="email" name="email" className="form-input"
                                placeholder={t('cart.email')} value={shippingInfo.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('cart.phone')}</label>
                            <input
                                type="text" name="phone" className="form-input"
                                placeholder={t('cart.phone')} value={shippingInfo.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('cart.address')}</label>
                        <input
                            type="text" name="address" className="form-input"
                            placeholder={t('cart.address')} value={shippingInfo.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('cart.city')}</label>
                        <input
                            type="text" name="city" className="form-input"
                            placeholder={t('cart.city')} value={shippingInfo.city}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="shipping-right">
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-color)' }}>
                        <FaChevronLeft size={12} /> {t('cart.back_to_cart')}
                    </Link>
                </div>

                <h3 className="shipping-title">{t('cart.order_summary')}</h3>

                <div className="order-summary-mini">
                    {cartItems.map((item) => (
                        <div className="product-summary-item" key={item._id}>
                            <img src={getImageUrl(item.image)} alt={item.name} />
                            <div className="product-info">
                                <h4 style={{ fontSize: '14px' }}>{item.name}</h4>
                                <p>{t('cart.qty')}: {item.qty}</p>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {formatPrice(item.price * item.qty, i18n.language)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="coupon-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>{t('coupon.code')}</label>

                    <div
                        className="coupon-selector-btn"
                        onClick={() => setShowCouponModal(true)}
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#fff'
                        }}
                    >
                        {appliedCoupon ? (
                            <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                {t('coupon.apply')}: {appliedCoupon.code} (-{formatPrice(discountAmount, i18n.language)})
                            </span>
                        ) : (
                            <span style={{ color: '#666' }}>{t('cart.coupon_placeholder') || "Chọn hoặc nhập mã"}</span>
                        )}
                        <span>&gt;</span>
                    </div>

                    {appliedCoupon && (
                        <button
                            type="button"
                            onClick={() => applyCoupon(null)}
                            style={{ fontSize: '12px', color: 'red', background: 'none', border: 'none', alignSelf: 'flex-start', cursor: 'pointer', padding: 0 }}
                        >
                            {t('coupon.cancel_coupon')}
                        </button>
                    )}
                </div>

                <div className="summary-row">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatPrice(subTotal, i18n.language)}</span>
                </div>

                {discountAmount > 0 && (
                    <div className="summary-row" style={{ color: '#2ecc71' }}>
                        <span>{t('cart.discount')}</span>
                        <span>- {formatPrice(discountAmount, i18n.language)}</span>
                    </div>
                )}

                <div className="summary-row total">
                    <span>{t('cart.total')}</span>
                    <span>{formatPrice(finalTotal, i18n.language)}</span>
                </div>

                <div className="payment-methods">
                    <button className="btn-pay btn-pay-cod" onClick={() => handlePayment('cod')}>
                        <FaTruck /> {t('cart.checkout_cod')}
                    </button>

                    <button className="btn-pay btn-pay-stripe" onClick={() => handlePayment('stripe')}>
                        <FaCreditCard /> {t('cart.checkout_online')} (Stripe)
                    </button>
                </div>
            </div>

            <CouponSelector
                show={showCouponModal}
                onHide={() => setShowCouponModal(false)}
                cartTotal={subTotal}
                onApplyCoupon={handleSelectCoupon}
            />
        </div>
    );
};

export default ShippingPage;