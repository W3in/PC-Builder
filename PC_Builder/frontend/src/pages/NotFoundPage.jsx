import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../assets/styles/NotFound.css';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="notfound-wrapper">
            <div className="notfound-content">
                <h1 className="glitch-text">404</h1>

                <h2 className="notfound-title">
                    {t('not_found.title')}
                </h2>

                <p className="notfound-desc">{t('not_found.desc')}</p>

                <Link to="/" className="home-btn">
                    {t('not_found.btn_home')}
                </Link>
            </div>

            <div className="notfound-image-container">
                <img
                    src="/images/ui/Lost Kosmonaut_Tired Now-min.png"
                    alt="Lost Astronaut"
                    className="astronaut-full-img"
                />
                <div className="img-overlay"></div>
            </div>
        </div>
    );
};
export default NotFoundPage;