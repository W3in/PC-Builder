import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTwitter, FaRedditAlien, FaLinkedinIn, FaPinterestP, FaChevronRight } from 'react-icons/fa';
import '../../assets/styles/Footer.css';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer-wrapper">
            <div className="footer-cta">
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{t('footer.cta_text')}</div>
                <Link to="/forum" className="cta-btn">{t('footer.cta_btn')}</Link>
            </div>

            <div className="footer-main">
                <div className="footer-col">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Chakra Petch', color: '#fff' }}>PC Builder ®</span>
                    </div>
                    <p className="footer-desc">{t('footer.desc')}</p>

                    {/* Social Icons */}
                    <div className="social-icons">
                        <FaFacebookF className="social-icon" />
                        <FaTwitter className="social-icon" />
                        <FaRedditAlien className="social-icon" />
                        <FaLinkedinIn className="social-icon" />
                    </div>
                </div>

                <div className="footer-col">
                    <h3>{t('footer.popular_tags')}</h3>
                    <div className="tags-container">
                        <span className="tag-badge">Build My PC</span>
                        <span className="tag-badge">Gaming PC Build</span>
                        <span className="tag-badge">Custom PC</span>
                        <span className="tag-badge">RTX 4090</span>
                        <span className="tag-badge">Intel Core i9</span>
                        <span className="tag-badge">Budget PC</span>
                    </div>
                </div>

                <div className="footer-col">
                    <h3>{t('footer.useful_links')}</h3>
                    <ul className="footer-links">
                        <li><Link to="/about"><FaChevronRight size={10} /> {t('footer.about_us')}</Link></li>
                        <li><Link to="/contact"><FaChevronRight size={10} /> {t('footer.contact_us')}</Link></li>
                        <li><Link to="/forum"><FaChevronRight size={10} /> {t('footer.forum')}</Link></li>
                        <li><Link to="/blog"><FaChevronRight size={10} /> {t('footer.blog')}</Link></li>
                    </ul>
                </div>
            </div>

            {/* 3. Copyright */}
            <div className="footer-bottom">
                {t('footer.copyright')}
            </div>
        </footer>
    );
};

export default Footer;