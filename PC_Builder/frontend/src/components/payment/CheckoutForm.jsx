import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import '../../assets/styles/Payment.css';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { cartItems, finalTotal, subTotal, appliedCoupon, clearCart } = useCart();
    const { user } = useAuth();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        // 1. Gửi yêu cầu thanh toán lên Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // QUAN TRỌNG: Phải có return_url dù dùng "if_required"
                // Đây là trang khách sẽ được đưa về nếu phải xác thực 3D Secure
                return_url: `${window.location.origin}/order-success`,
            },
            redirect: "if_required", // Chỉ redirect nếu ngân hàng bắt buộc
        });

        if (error) {
            // Xử lý lỗi (Thẻ lỗi, thiếu tiền, v.v...)
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // 2. Thanh toán thành công (Không cần redirect) -> Gọi API lưu đơn
            try {
                // Lấy shippingAddress từ localStorage (được lưu ở bước trước)
                const shippingAddressStr = localStorage.getItem('shippingAddress');
                if (!shippingAddressStr) {
                    throw new Error("Không tìm thấy địa chỉ giao hàng");
                }
                const shippingAddress = JSON.parse(shippingAddressStr);

                const orderData = {
                    orderItems: cartItems,
                    shippingAddress: shippingAddress,
                    itemsPrice: subTotal,
                    totalPrice: finalTotal,
                    couponCode: appliedCoupon ? appliedCoupon.code : null,
                    paymentMethod: 'Stripe',
                    isPaid: true,

                    // Thông tin giao dịch từ Stripe trả về
                    paymentResult: {
                        id: paymentIntent.id,
                        status: paymentIntent.status,
                        update_time: new Date().toISOString(),
                        email_address: paymentIntent.receipt_email || user?.email,
                    }
                };

                await axiosClient.post('/orders', orderData);

                clearCart();
                navigate("/order-success");

            } catch (err) {
                console.error("Lỗi lưu đơn hàng:", err);
                setMessage("Thanh toán thành công nhưng lỗi lưu đơn (" + (err.response?.data?.message || err.message) + "). Vui lòng chụp màn hình và liên hệ Admin.");
                setIsProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <PaymentElement />
            <button disabled={isProcessing || !stripe} className="btn-pay">
                {isProcessing ? t('payment.processing_btn') : t('payment.pay_now')}
            </button>
            {message && <div className="payment-error-msg">{message}</div>}
        </form>
    );
};

export default CheckoutForm;