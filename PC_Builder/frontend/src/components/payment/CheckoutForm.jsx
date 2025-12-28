import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import '../../assets/styles/Payment.css';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();

    const { cartItems, finalTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        // 1. Xác thực thanh toán với Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {

            try {
                const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
                const orderData = {
                    orderItems: cartItems,
                    shippingAddress: shippingAddress,
                    totalPrice: finalTotal,
                    paymentMethod: 'Stripe',
                    isPaid: true,
                };

                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                await axiosClient.post('/orders', orderData, config);

                clearCart();

                window.location.href = "/order-success";

            } catch (err) {
                console.error("Lỗi lưu đơn hàng:", err);
                setMessage("Thanh toán thành công nhưng lỗi lưu đơn. Vui lòng liên hệ Admin.");
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