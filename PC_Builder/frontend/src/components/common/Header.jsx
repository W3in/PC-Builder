import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Import Icon từ thư viện react-icons
import { FaSearch, FaUserCircle, FaShoppingCart, FaMoon, FaSun, FaWrench, FaLaptop, FaMicrochip, FaMemory, FaHdd, FaFan } from 'react-icons/fa';
import { BsMotherboard, BsGpuCard, BsDeviceSsd } from "react-icons/bs";
import { GiPowerGenerator, GiComputerFan } from "react-icons/gi";
import { RiComputerLine } from "react-icons/ri";

import '../../assets/styles/Header.css';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const mainComponents = [
        {
            name: "Storage",
            img: "https://static.pcbuilder.net/assets/images/megamenu/storage.png"
        },
        {
            name: "Graphics Card",
            img: "https://static.pcbuilder.net/assets/images/megamenu/graphics-card.png"
        },
        {
            name: "Power Supply",
            img: "https://static.pcbuilder.net/assets/images/megamenu/power-supply.png"
        },
        {
            name: "Case",
            img: "https://static.pcbuilder.net/assets/images/megamenu/case.png"
        },
        {
            name: "CPU",
            img: "https://static.pcbuilder.net/assets/images/mega-menu/nav-processor.png"
        },
        {
            name: "CPU Cooler",
            img: "https://static.pcbuilder.net/assets/images/megamenu/cpu-cooler.png"
        },
        {
            name: "Motherboard",
            img: "https://static.pcbuilder.net/assets/images/megamenu/motherboard.png"
        },
        {
            name: "Memory",
            img: "https://static.pcbuilder.net/assets/images/megamenu/memory.png"
        },
    ];

    const subCategories = [
        {
            title: "Cooling",
            items: ["Case Fans", "Thermal Compound"]
        },
        {
            title: "Expansion",
            items: ["Sound Cards", "Wired Networking", "Wireless Networking"]
        },
        {
            title: "Peripherals",
            items: ["Headphones", "Keyboards", "Mouse", "Speakers", "Webcam"]
        },
        {
            title: "Software",
            items: ["Antivirus", "Utilities", "Operating Systems"]
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
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>


                <div className="user-actions">
                    <div className="action-item">
                        <FaUserCircle className="icon-btn" />
                        <div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Welcome</div>
                            <div style={{ fontWeight: 'bold' }}>Sign In / Register</div>
                        </div>
                    </div>

                    <div className="action-item">
                        <Link to="/cart" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                            <div style={{ position: 'relative' }}>
                                <FaShoppingCart className="icon-btn" />
                                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', fontSize: '10px', padding: '2px 5px', borderRadius: '50%' }}>0</span>
                            </div>
                            <span>Cart</span>
                        </Link>
                    </div>

                    <div className="dark-mode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <FaMoon color="#f1c40f" /> : <FaSun color="orange" />}
                        <div style={{ width: '24px', height: '12px', background: isDarkMode ? '#2ecc71' : '#ccc', borderRadius: '10px', position: 'relative' }}>
                            <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%', position: 'absolute', top: '1px', left: isDarkMode ? '13px' : '1px', transition: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sub-navbar">
                <Link to="/builder" className="nav-item active">
                    <FaWrench style={{ marginRight: '8px' }} /> System Builder
                </Link>

                <div className="nav-item-group" style={{ height: '100%' }}>
                    <div className="nav-item">
                        <FaMicrochip style={{ marginRight: '8px' }} /> Browse Products ▾
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