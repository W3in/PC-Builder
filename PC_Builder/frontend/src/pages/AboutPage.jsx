import React from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/styles/About.css';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="about-container">
            <div className="about-hero">
                <h1>PC BUILDER ®</h1>
                <p>{t('footer.desc')}</p>
            </div>

            <div className="about-grid">
                <div className="about-content">
                    <div className="about-card">
                        <h3>{t('about.story')}</h3>
                        <p>{t('about.story_desc')}</p>
                    </div>
                    <div className="about-card">
                        <h3>{t('about.mission')}</h3>
                        <p>{t('about.mission_desc')}</p>
                    </div>
                </div>
                <div className="about-img">
                    <img src="/images/ui/about-pc.png" alt="About PC" />
                </div>
            </div>
        </div>
    );
};
export default AboutPage;