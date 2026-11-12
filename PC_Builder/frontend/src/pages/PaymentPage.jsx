import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axiosClient from '../api/axiosClient';
import CheckoutForm from '../components/payment/CheckoutForm';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/format';
import { useTheme } from '../context/ThemeContext';
import '../assets/styles/Payment.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { finalTotal, cartItems, appliedCoupon } = useCart();
    const [clientSecret, setClientSecret] = useState("");
    const [serverTotal, setServerTotal] = useState(null);
    // A string key so a re-created (but identical) cart array doesn't create a second PaymentIntent.
    const cartKey = JSON.stringify(cartItems.map(item => [item._id, item.qty])) + (appliedCoupon?.code || '');

    useEffect(() => {
        const createIntent = async () => {
            if (finalTotal <= 0) return;
            try {
                // The server prices the cart itself; we only send product ids and quantities.
                const { data } = await axiosClient.post('/payment/create-intent', {
                    orderItems: cartItems.map(item => ({ _id: item._id, name: item.name, qty: item.qty })),
                    couponCode: appliedCoupon ? appliedCoupon.code : null
                });
                setClientSecret(data.clientSecret);
                setServerTotal(data.amount);
            } catch (error) {
                console.error("Lỗi tạo thanh toán:", error);
                alert(error.response?.data?.message || "Lỗi kết nối cổng thanh toán.");
            }
        };
        createIntent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartKey]);

    const appearance = {
        theme: theme === 'dark' ? 'night' : 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
        labels: 'floating',
        locale: i18n.language,
    };

    return (
        <div className="payment-container">
            <h1 className="payment-title">
                {t('payment.title')}
            </h1>

            <div className="payment-summary-box">
                <p className="payment-summary-text">
                    {t('payment.total')}:
                    <span className="payment-total-highlight">
                        {formatPrice(serverTotal ?? finalTotal, i18n.language)}
                    </span>
                </p>
            </div>

            {clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            ) : (
                <div>{t('payment.processing')}</div>
            )}
        </div>
    );
};

export default PaymentPage;