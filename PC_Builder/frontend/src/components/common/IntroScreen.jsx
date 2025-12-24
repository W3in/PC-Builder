import React, { useState } from 'react';
import { FaPlay, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/Intro.css';

const IntroScreen = ({ onEnter }) => {
    const { t } = useTranslation();
    const [isFading, setIsFading] = useState(false);

    const handleStart = () => {
        setIsFading(true);
        setTimeout(() => {
            onEnter();
        }, 800);
    };

    return (
        <div className={`intro-container ${isFading ? 'fade-out' : ''}`}>
            <video autoPlay loop muted playsInline className="intro-video">
                <source src="/videos/intro.mp4" type="video/mp4" />
            </video>

            <div className="intro-overlay"></div>

            <div className="intro-content">
                <h1 className="glitch-text-intro">PC BUILDER</h1>
                <p className="intro-slogan">{t('intro.slogan')}</p>

                <button className="enter-btn" onClick={handleStart}>
                    {t('intro.enter_btn')} <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default IntroScreen;