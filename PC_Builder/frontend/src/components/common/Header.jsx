import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaShoppingCart, FaMoon, FaSun, FaWrench, FaMicrochip, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/Header.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
const Header = () => {
    const { t, i18n } = useTranslation();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const languages = [
        { code: 'vi', label: 'Tiếng Việt', flag: 'https://flagcdn.com/w40/vn.png' },
        { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'ja', label: '日本語', flag: 'https://flagcdn.com/w40/jp.png' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const handleLanguageSelect = (code) => {
        i18n.changeLanguage(code);
        setShowLangMenu(false);
    };
    const mainComponents = [
        {
            name: t('category.storage'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/storage.png"
        },
        {
            name: t('category.gpu'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/graphics-card.png"
        },
        {
            name: t('category.psu'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/power-supply.png"
        },
        {
            name: t('category.case'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/case.png"
        },
        {
            name: t('category.cpu'),
            img: "https://static.pcbuilder.net/assets/images/mega-menu/nav-processor.png"
        },
        {
            name: t('category.cooler'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/cpu-cooler.png"
        },
        {
            name: t('category.mainboard'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/motherboard.png"
        },
        {
            name: t('category.ram'),
            img: "https://static.pcbuilder.net/assets/images/megamenu/memory.png"
        },
    ];

    const subCategories = [
        {
            title: t('subcategory.cooling'),
            items: [t('subcategory.case_fans'), t('subcategory.thermal')]
        },
        {
            title: t('subcategory.expansion'),
            items: [t('subcategory.sound_card'), t('subcategory.wired_net'), t('subcategory.wifi_net')]
        },
        {
            title: t('subcategory.peripherals'),
            items: [t('subcategory.headphones'), t('subcategory.keyboard'), t('subcategory.mouse'), t('subcategory.speakers'), t('subcategory.webcam')]
        },
        {
            title: t('subcategory.software'),
            items: [t('subcategory.antivirus'), t('subcategory.utilities'), t('subcategory.os')]
        }
    ];
    return (
        <header>
            <div className="top-header">
                <div className="logo-area">
                    <Link to="/">
                        <div className="logo-icon">P</div>
                        <span>PC Builder ®</span>
                    </Link>
                </div>

                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder={t('header.search_placeholder')} className="search-input" />
                </div>


                <div className="user-actions">
                    <div className="action-item">
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaUserCircle className="icon-btn" style={{ color: '#26a69a' }} />
                                <div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>{t('header.welcome')}</div>
                                    <div style={{ fontWeight: 'bold', color: '#26a69a' }}>{user.name}</div>
                                </div>
                                <button
                                    onClick={logout}
                                    title={t('header.logout')}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', marginLeft: '5px' }}
                                >
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}>
                                <FaUserCircle className="icon-btn" />
                                <div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>{t('header.welcome')}</div>
                                    <div style={{ fontWeight: 'bold' }}>{t('header.login')}</div>
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="action-item">
                        <Link to="/cart" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                            <div style={{ position: 'relative' }}>
                                <FaShoppingCart className="icon-btn" />
                                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', fontSize: '10px', padding: '2px 5px', borderRadius: '50%' }}>0</span>
                            </div>
                            <span>{t('header.cart')}</span>
                        </Link>
                    </div>

                    <div className="lang-wrapper">
                        <span className="lang-label">{t('header.language')}:</span>

                        <div className="lang-dropdown">
                            <div className="lang-current" onClick={() => setShowLangMenu(!showLangMenu)}>
                                <img src={currentLang.flag} alt="" style={{ width: '20px', borderRadius: '2px' }} />
                                <span style={{ fontSize: '14px', flex: 1 }}>{currentLang.label}</span>
                                <FaChevronDown size={10} />
                            </div>

                            {showLangMenu && (
                                <div className="lang-list">
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.code}
                                            className="lang-item"
                                            onClick={() => handleLanguageSelect(lang.code)}
                                        >
                                            <img src={lang.flag} alt="" style={{ width: '20px', borderRadius: '2px' }} />
                                            <span style={{ fontSize: '13px' }}>{lang.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dark-mode-toggle" onClick={toggleTheme}>
                        {theme === 'dark' ? <FaMoon color="#f1c40f" /> : <FaSun color="orange" />}
                        <div style={{ width: '24px', height: '12px', background: theme === 'dark' ? '#2ecc71' : '#ccc', borderRadius: '10px', position: 'relative' }}>
                            <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%', position: 'absolute', top: '1px', left: theme === 'dark' ? '13px' : '1px', transition: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sub-navbar">
                <Link to="/builder" className="nav-item active">
                    <FaWrench style={{ marginRight: '8px' }} /> {t('header.system_builder')}
                </Link>

                <div className="nav-item-group" style={{ height: '100%' }}>
                    <div className="nav-item">
                        <FaMicrochip style={{ marginRight: '8px' }} /> {t('header.browse')}
                    </div>

                    <div className="mega-menu-container">
                        <div className="mega-content-wrapper">

                            <div className="mega-left">
                                {mainComponents.map((cat, index) => (
                                    <div key={index} className="mega-box-item">
                                        <div className="mega-box-title">{cat.name}</div>
                                        <div className="mega-box-img-wrapper">
                                            <img src={cat.img} alt={cat.name} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mega-right">
                                {subCategories.map((group, index) => (
                                    <div key={index} className="mega-list-column">
                                        <h4 className="mega-list-title">{group.title}</h4>
                                        <ul>
                                            {group.items.map((item, i) => (
                                                <li key={i} className="mega-list-item">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;