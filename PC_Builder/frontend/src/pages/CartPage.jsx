import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaCreditCard, FaTruck } from 'react-icons/fa';
import '../assets/styles/Builder.css';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const { cartItems, removeFromCart, finalTotal, subTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('cart.empty')}</h2>
                <Link to="/builder" style={{ color: '#26a69a' }}>{t('cart.continue')}</Link>
            </div>
        );
    }

    return (
        <div className="builder-wrapper" style={{ marginTop: '40px' }}>
            <h1>{t('cart.title')}</h1>

            <div className="builder-table-container">
                <table className="builder-table">
                    <thead>
                        <tr>
                            <th>{t('cart.product')}</th>
                            <th>{t('cart.price')}</th>
                            <th>{t('cart.qty')}</th>
                            <th>{t('cart.total')}</th>
                            <th>{t('cart.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item._id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={item.image} alt="" style={{ width: '50px' }} />
                                    <b>{item.name}</b>
                                </td>
                                <td>{formatPrice(item.price, i18n.language)}</td>
                                <td>{item.qty}</td>
                                <td style={{ color: '#26a69a', fontWeight: 'bold' }}>
                                    {formatPrice(item.price * item.qty, i18n.language)}
                                </td>
                                <td>
                                    <button className="btn-remove" onClick={() => removeFromCart(item._id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Khu vực thanh toán */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <div style={{ width: '400px', background: '#0b1d2a', padding: '20px', borderRadius: '8px', border: '1px solid #1c2e3e' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>{t('cart.subtotal')}:</span>
                        <span>{formatPrice(subTotal, i18n.language)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: '#26a69a' }}>
                        <span>{t('cart.final_total')}:</span>
                        <span>{formatPrice(finalTotal, i18n.language)}</span>
                    </div>

                    <button className="btn-buy-now" style={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        <FaTruck /> {t('cart.checkout_cod')}
                    </button>

                    <button
                        className="btn-buy-now"
                        onClick={() => navigate('/payment')}
                        style={{ width: '100%', background: '#6772e5', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <FaCreditCard /> {t('cart.checkout_online')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;