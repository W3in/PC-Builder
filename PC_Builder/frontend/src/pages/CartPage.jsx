import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatPrice, getImageUrl } from '../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaCreditCard, FaTruck, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../assets/styles/Builder.css';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { cartItems, removeFromCart, addToCart, decreaseQty, finalTotal, subTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('cart.empty')}</h2>
                <Link to="/builder" style={{ color: '#26a69a' }}>{t('cart.continue')}</Link>
            </div>
        );
    }

    const handleCheckout = () => {
        if (!user) {
            toast.warning(t('cart.login_required') || 'Vui lòng đăng nhập để tiếp tục thanh toán');
            navigate('/login', { state: { from: '/shipping' } });
            return
        }
        navigate('/shipping');
    };

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
                                    <img src={getImageUrl(item.image)} alt="" style={{ width: '50px' }} />
                                    <b>{item.name}</b>
                                </td>
                                <td>{formatPrice(item.price, i18n.language)}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => decreaseQty(item._id)}
                                            style={{ background: '#eee', border: 'none', width: '25px', height: '25px', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            <FaMinus size={10} color="#333" />
                                        </button>

                                        <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.qty}</span>

                                        <button
                                            onClick={() => addToCart(item)}
                                            style={{ background: '#eee', border: 'none', width: '25px', height: '25px', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            <FaPlus size={10} color="#333" />
                                        </button>
                                    </div>
                                </td>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <div className="shipping-right">
                    <div className="summary-row">
                        <span>{t('cart.subtotal')}:</span>
                        <span>{formatPrice(subTotal, i18n.language)}</span>
                    </div>

                    <div className="summary-row total">
                        <span>{t('cart.final_total')}:</span>
                        <span>{formatPrice(finalTotal, i18n.language)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="btn-pay btn-pay-stripe"
                        style={{ background: 'var(--accent-color)' }}
                    >
                        <FaCreditCard style={{ marginRight: '8px' }} />
                        {t('cart.continue_checkout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;