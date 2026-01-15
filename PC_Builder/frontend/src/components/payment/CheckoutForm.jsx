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

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-success`,
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
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