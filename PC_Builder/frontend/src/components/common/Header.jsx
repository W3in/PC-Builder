import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaShoppingCart, FaMoon, FaSun, FaWrench, FaMicrochip, FaChevronDown, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/Header.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);

    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);


    const isActive = (path) => {
        if (isBrowseOpen) return '';

        return location.pathname === path ? 'active' : '';
    };

    const toggleBrowse = () => {
        setIsBrowseOpen(!isBrowseOpen);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsBrowseOpen(false);
    }, [location.pathname]);

    const languages = [
        { code: 'vi', label: 'Tiếng Việt', flag: '/images/flags/vn.png' },
        { code: 'en', label: 'English', flag: '/images/flags/us.png' },
        { code: 'ja', label: '日本語', flag: '/images/flags/jp.png' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const handleLanguageSelect = (code) => {
        i18n.changeLanguage(code);
        setShowLangMenu(false);
    };
    const mainComponents = [
        {
            name: t('category.storage'),
            img: "/images/components/storage.png",
            path: "storage"
        },
        {
            name: t('category.gpu'),
            img: "/images/components/graphics-card.png",
            path: "gpu"
        },
        {
            name: t('category.psu'),
            img: "/images/components/power-supply.png",
            path: "psu"
        },
        {
            name: t('category.case'),
            img: "/images/components/case.png",
            path: "case"
        },
        {
            name: t('category.cpu'),
            img: "/images/components/nav-processor.png",
            path: "cpu"
        },
        {
            name: t('category.cooler'),
            img: "/images/components/cpu-cooler.png",
            path: "cooler"
        },
        {
            name: t('category.mainboard'),
            img: "/images/components/motherboard.png",
            path: "mainboard"
        },
        {
            name: t('category.ram'),
            img: "/images/components/memory.png",
            path: "ram"
        },
    ];

    const subCategories = [
        {
            title: "cooling",
            items: ["case_fans", "thermal"]
        },
        {
            title: "expansion",
            items: ["sound_card", "wired_net", "wifi_net"]
        },
        {
            title: "peripherals",
            items: ["headphones", "keyboard", "mouse", "speakers", "webcam"]
        },
        {
            title: "software",
            items: ["antivirus", "utilities", "os"]
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
                                <Link
                                    to={user.isAdmin ? "/admin/dashboard" : "/profile"}
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                                >
                                    {user.isAdmin ? (
                                        <FaUserShield className="icon-btn" style={{ color: '#f1c40f' }} />
                                    ) : (
                                        <FaUserCircle className="icon-btn" style={{ color: '#26a69a' }} />
                                    )}

                                    <div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>
                                            {user.isAdmin ? "Administrator" : t('header.welcome')}
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: user.isAdmin ? '#f1c40f' : '#26a69a' }}>
                                            {user.name}
                                        </div>
                                    </div>
                                </Link>

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
                                {totalItems > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '-8px', right: '-8px',
                                        background: '#ff4d4d', color: 'white',
                                        fontSize: '10px', fontWeight: 'bold',
                                        padding: '2px 6px', borderRadius: '50%',
                                        minWidth: '18px', textAlign: 'center'
                                    }}>
                                        {totalItems}
                                    </span>
                                )}
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
                <Link to="/builder" className={`nav-item ${isActive('/builder')}`}>
                    <FaWrench style={{ marginRight: '8px' }} /> {t('header.system_builder')}
                </Link>

                <div className="nav-item-group" style={{ height: '100%' }}>
                    <div
                        className={`nav-item ${isBrowseOpen ? 'active' : ''}`}
                        onClick={toggleBrowse}
                    >
                        <FaMicrochip style={{ marginRight: '8px' }} /> {t('header.browse')}
                    </div>
                    {isBrowseOpen && (
                        <div className="mega-menu-container">
                            <div className="mega-content-wrapper">

                                <div className="mega-left">
                                    {mainComponents.map((cat, index) => (
                                        <Link
                                            to={`/builder/select/${cat.path}`}
                                            key={index}
                                            className="mega-box-item"
                                            style={{ textDecoration: 'none' }}
                                            onClick={() => setIsBrowseOpen(false)}
                                        >
                                            <div className="mega-box-title">{cat.name}</div>
                                            <div className="mega-box-img-wrapper">
                                                <img src={cat.img} alt={cat.name} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mega-right">
                                    {subCategories.map((group, index) => (
                                        <div key={index} className="mega-list-column">
                                            <h4 className="mega-list-title">{t(`subcategory.${group.title}`)}</h4>
                                            <ul>
                                                {group.items.map((item, i) => (
                                                    <li key={i} className="mega-list-item" onClick={() => setIsBrowseOpen(false)}>
                                                        <Link
                                                            to={`/builder/select/${item}`}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                        >
                                                            {t(`subcategory.${item}`)}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;