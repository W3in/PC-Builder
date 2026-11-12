import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import '../../assets/styles/Payment.css';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { cartItems, appliedCoupon, clearCart } = useCart();

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

                // The server re-prices the cart and checks this PaymentIntent with Stripe itself.
                const orderData = {
                    orderItems: cartItems,
                    shippingAddress: shippingAddress,
                    couponCode: appliedCoupon ? appliedCoupon.code : null,
                    paymentMethod: 'Stripe',
                    paymentResult: { id: paymentIntent.id }
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