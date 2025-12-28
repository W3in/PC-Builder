import React, { useState, useEffect, useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/format';
import { getRecommendedPrice } from '../utils/budgetRule';
import { generateSlots, groupComponents } from '../utils/builderHelper';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaCalculator, FaMinus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Builder.css';


const DEFAULT_BUDGETS = {
    vi: 20000000,
    en: 800,
    ja: 120000
};

const BuilderPage = () => {
    const { t, i18n } = useTranslation();
    const { buildState, totalPrice, removeComponent, updateQuantity } = useBuilder();
    const { addToCartBatch } = useCart();
    const navigate = useNavigate();

    const [localBudget, setLocalBudget] = useState(() => {
        return DEFAULT_BUDGETS[i18n.language] || DEFAULT_BUDGETS['vi'];
    });

    const rawSlots = useMemo(() => {
        return generateSlots(buildState, t);
    }, [buildState, t]);

    const groupedSlots = useMemo(() => {
        return groupComponents(rawSlots, buildState);
    }, [rawSlots, buildState]);
    useEffect(() => {
        const newDefault = DEFAULT_BUDGETS[i18n.language] || DEFAULT_BUDGETS['vi'];
        // eslint-disable-next-line react-hooks/exhaustive-deps
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


    const goToSelection = (slotKey, slotType) => {
        const rate = i18n.language === 'en' ? 0.00004 : (i18n.language === 'ja' ? 0.006 : 1);
        const budgetInVND = localBudget / rate;

        const recommendedVND = getRecommendedPrice(budgetInVND, slotType);

        navigate(`/builder/select/${slotType}?budget=${recommendedVND}&slot=${slotKey}`);
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

                        {groupedSlots.map((group) => {
                            const { product, qty, slotKeys, type, label, key } = group;
                            const recommendLocal = getRecommendedPrice(localBudget, type) * (qty || 1);

                            const hintPrice = new Intl.NumberFormat(
                                i18n.language === 'en' ? 'en-US' : (i18n.language === 'ja' ? 'ja-JP' : 'vi-VN'),
                                {
                                    style: 'currency',
                                    currency: i18n.language === 'en' ? 'USD' : (i18n.language === 'ja' ? 'JPY' : 'VND'),
                                    maximumFractionDigits: 0
                                }
                            ).format(recommendLocal);

                            return (
                                <tr key={key}>
                                    <td className="comp-label">
                                        {qty > 1 ? `${label.split('(')[0]} (x${qty})` : label}
                                        <div className="price-hint">
                                            {t('builder.suggest')}: ~{hintPrice}
                                        </div>
                                    </td>

                                    {product ? (
                                        <>
                                            <td className="comp-img">
                                                <img src={getImageUrl(product.image)} alt={product.name} />
                                            </td>
                                            <td className="comp-name">
                                                <Link to={`/product/${product._id}`}>{product.name}</Link>
                                                {['ram', 'gpu', 'storage'].includes(type) && (
                                                    <div className="qty-control">
                                                        <button
                                                            className="btn-qty"
                                                            onClick={() => updateQuantity(product, slotKeys, type, -1)}
                                                        >
                                                            <FaMinus size={10} />
                                                        </button>
                                                        <span className="qty-number">{qty}</span>
                                                        <button
                                                            className="btn-qty"
                                                            onClick={() => updateQuantity(product, slotKeys, type, 1)}
                                                        >
                                                            <FaPlus size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="comp-price">
                                                {formatPrice(group.totalPrice, i18n.language)}
                                                {qty > 1 && (
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                        ({formatPrice(product.price, i18n.language)} / {t('builder.slots.item')})
                                                    </div>
                                                )}
                                            </td>
                                            <td className="comp-action">
                                                <button className="btn-remove" onClick={() => {
                                                    slotKeys.forEach(k => removeComponent(k));
                                                }}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <td colSpan="4" className="comp-empty">
                                            <button
                                                className="btn-add-component"
                                                onClick={() => goToSelection(key, type)}
                                            >
                                                <FaPlus /> {t('builder.btn_choose')} {type.toUpperCase()}
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