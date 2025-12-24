import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../assets/styles/ComingSoon.css';

const ComingSoon = ({ titleKey }) => {
    const { t } = useTranslation();

    return (
        <div className="coming-soon-wrapper">
            <FaCog className="gear-icon" />

            <h1 className="coming-title">
                {t(titleKey)}
                <br />
                <span style={{ fontSize: '0.8em', color: '#888' }}>
                    {t('coming_soon.status')}
                </span>
            </h1>

            <p className="coming-desc">
                {t('coming_soon.desc')}
            </p>

            <Link to="/" className="back-home-btn">
                {t('coming_soon.back_home')}
            </Link>
        </div>
    );
};

export default ComingSoon;