import React, { useState, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format'; // Import hàm mới
import { getRecommendedPrice } from '../utils/budgetRule';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaCalculator } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Builder.css';

const COMPONENT_KEYS = [
    'cpu', 'mainboard', 'cooler', 'ram', 'gpu', 'storage', 'storage2', 'psu', 'case'
];

const DEFAULT_BUDGETS = {
    vi: 20000000,
    en: 800,
    ja: 120000
};

const BuilderPage = () => {
    const { t, i18n } = useTranslation();
    const { buildState, totalPrice, removeComponent } = useBuilder();
    const { addToCartBatch } = useCart();
    const navigate = useNavigate();

    const [localBudget, setLocalBudget] = useState(() => {
        return DEFAULT_BUDGETS[i18n.language] || DEFAULT_BUDGETS['vi'];
    });

    useEffect(() => {
        const newDefault = DEFAULT_BUDGETS[i18n.language] || DEFAULT_BUDGETS['vi'];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalBudget(newDefault);
    }, [i18n.language]);


    const handleAddAllToCart = () => {
        const items = Object.values(buildState);
        if (items.length === 0) {
            alert(t('builder.alert_empty'));
            return;
        }
        addToCartBatch(items);
        navigate('/cart');
    };

    const goToSelection = (key) => {
        const rate = i18n.language === 'en' ? 0.00004 : (i18n.language === 'ja' ? 0.006 : 1);
        const budgetInVND = localBudget / rate;


        const categoryForCalculation = key === 'storage2' ? 'storage' : key;
        const recommendedVND = getRecommendedPrice(budgetInVND, categoryForCalculation);

        navigate(`/builder/select/${categoryForCalculation}?budget=${recommendedVND}&slot=${key}`);
    };
    return (
        <div className="builder-wrapper">
            <div className="budget-control-panel">
                <div className="budget-input-group">
                    <label>
                        <FaCalculator style={{ marginBottom: '-2px', marginRight: '5px' }} />
                        {t('builder.budget')}:
                    </label>
                    <input
                        type="number"
                        value={localBudget}
                        onChange={(e) => setLocalBudget(Number(e.target.value))}
                        step={i18n.language === 'vi' ? 500000 : 10}
                    />
                    <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                        {i18n.language === 'en' ? 'USD' : i18n.language === 'ja' ? 'JPY' : 'VND'}
                    </span>
                </div>
                <div className="budget-info">
                    <p>
                        {t('builder.spent')}: <span className="spent">
                            {formatPrice(totalPrice, i18n.language)}
                        </span>
                    </p>
                    {(() => {
                        const rate = i18n.language === 'en' ? 0.00004 : (i18n.language === 'ja' ? 0.006 : 1);
                        const spentLocal = totalPrice * rate;
                        const remain = localBudget - spentLocal;

                        const remainFormatted = new Intl.NumberFormat(
                            i18n.language === 'en' ? 'en-US' : (i18n.language === 'ja' ? 'ja-JP' : 'vi-VN'),
                            {
                                style: 'currency',
                                currency: i18n.language === 'en' ? 'USD' : (i18n.language === 'ja' ? 'JPY' : 'VND'),
                                maximumFractionDigits: 0
                            }
                        ).format(remain);

                        return (
                            <p>
                                {t('builder.remaining')}: <span className={remain < 0 ? 'over-budget' : 'remain'}>
                                    {remainFormatted}
                                </span>
                            </p>
                        );
                    })()}
                </div>
            </div>

            <div className="builder-header-bar">
                <h1>{t('builder.title')}</h1>
                <div className="builder-summary">
                    <span className="total-price">
                        {t('builder.total')}: {formatPrice(totalPrice, i18n.language)}
                    </span>
                </div>
            </div>

            <div className="builder-table-container">
                <table className="builder-table">
                    <thead>
                        <tr>
                            <th>{t('builder.table.component')}</th>
                            <th>{t('builder.table.image')}</th>
                            <th>{t('builder.table.name')}</th>
                            <th>{t('builder.table.price')}</th>
                            <th>{t('builder.table.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPONENT_KEYS.map((key) => {
                            const product = buildState[key];
                            const label = t(`builder.components.${key}`);

                            const recommendLocal = getRecommendedPrice(localBudget, key);

                            const hintPrice = new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : (i18n.language === 'ja' ? 'ja-JP' : 'vi-VN'), {
                                style: 'currency',
                                currency: i18n.language === 'en' ? 'USD' : (i18n.language === 'ja' ? 'JPY' : 'VND'),
                                maximumFractionDigits: 0
                            }).format(recommendLocal);

                            return (
                                <tr key={key}>
                                    <td className="comp-label">
                                        {label}
                                        <div className="price-hint">
                                            {t('builder.suggest')}: ~{hintPrice}
                                        </div>
                                    </td>

                                    {product ? (
                                        <>
                                            <td className="comp-img">
                                                <img src={product.image} alt={product.name} />
                                            </td>
                                            <td className="comp-name">
                                                <Link to={`/product/${product._id}`}>{product.name}</Link>
                                            </td>
                                            <td className="comp-price">
                                                {formatPrice(product.price, i18n.language)}
                                            </td>
                                            <td className="comp-action">
                                                <button className="btn-remove" onClick={() => removeComponent(key)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <td colSpan="4" className="comp-empty">
                                            <button className="btn-add-component" onClick={() => goToSelection(key)}>
                                                <FaPlus /> {t('builder.btn_choose')} {label}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="builder-footer-bar">
                <div className="grand-total">
                    {t('builder.total')}: <span>{formatPrice(totalPrice, i18n.language)}</span>
                </div>
                <button className="btn-buy-now" onClick={handleAddAllToCart}>
                    <FaShoppingCart style={{ marginRight: '5px' }} /> {t('builder.add_all_cart')}
                </button>
            </div>
        </div>
    );
};

export default BuilderPage;