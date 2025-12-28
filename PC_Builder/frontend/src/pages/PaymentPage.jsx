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
    const { finalTotal } = useCart();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const createIntent = async () => {
            if (finalTotal <= 0) return;
            try {
                const { data } = await axiosClient.post('/payment/create-intent', {
                    amount: finalTotal
                });
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Lỗi tạo thanh toán:", error);
                alert("Lỗi kết nối cổng thanh toán.");
            }
        };
        createIntent();
    }, [finalTotal]);

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
                        {formatPrice(finalTotal, i18n.language)}
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