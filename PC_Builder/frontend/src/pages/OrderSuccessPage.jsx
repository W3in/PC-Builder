import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Payment.css';

const OrderSuccessPage = () => {
    const { t } = useTranslation();

    return (
        <div className="success-container">
            <FaCheckCircle className="success-icon" />

            <h1 className="success-title">
                {t('payment.success_title')}
            </h1>

            <p className="success-desc">
                {t('payment.success_desc')}
            </p>

            <Link to="/" className="btn-continue">
                {t('payment.continue_shopping')}
            </Link>
        </div>
    );
};

export default OrderSuccessPage;