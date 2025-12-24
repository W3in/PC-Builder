import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/Payment.css';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/order-success",
            },
        });

        if (error) setMessage(error.message);
        setIsProcessing(false);
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