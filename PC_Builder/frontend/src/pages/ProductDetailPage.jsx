import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatPrice, getImageUrl } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useBuilder } from '../context/BuilderContext';
import { useTranslation } from 'react-i18next';
import { FaShoppingCart, FaWrench, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../assets/styles/ProductDetail.css';

const MsgWithLink = ({ msg, linkText, to, navigate }) => (
    <div className="toast-msg-container">
        <span>{msg}</span>
        <button className="toast-link-btn" onClick={() => navigate(to)}>
            {linkText}
        </button>
    </div>
);


const ProductDetailPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Lấy hàm từ Context
    const { addToCart } = useCart();
    const { addComponent, buildState } = useBuilder();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axiosClient.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product);

        toast.success(
            <MsgWithLink
                msg={t('toast.add_cart_success', { name: product.name })}
                linkText={t('toast.view_cart')}
                to="/cart"
                navigate={navigate}
            />
        );
    };

    const handleAddToBuilder = () => {
        if (!product) return;

        const category = product.category;
        let targetSlotKey = null;
        const singleComponents = ['mainboard', 'psu', 'case'];

        if (singleComponents.includes(category)) {
            targetSlotKey = category;
        } else {
            for (let i = 0; i < 10; i++) {
                const keyToCheck = `${category}_${i}`;
                if (!buildState[keyToCheck]) {
                    targetSlotKey = keyToCheck;
                    break;
                }
            }
            if (!targetSlotKey) targetSlotKey = `${category}_0`;
        }

        addComponent(targetSlotKey, product);

        toast.info(
            <MsgWithLink
                msg={t('toast.add_build_success', { slot: targetSlotKey })}
                linkText={t('toast.view_build')}
                to="/builder"
                navigate={navigate}
            />
        );
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>;
    if (!product) return <div style={{ textAlign: 'center', marginTop: 50 }}>Product not found</div>;

    return (
        <div className="product-detail-container">
            <div className="pd-back-wrapper">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <FaArrowLeft /> {t('selection.back')}
                </button>
            </div>


            <div className="pd-image-box">
                <img src={getImageUrl(product.image)} alt={product.name} />
            </div>

            <div className="pd-info">
                <h1>{product.name}</h1>
                <div className="pd-brand">Brand: {product.brand} | Category: {product.category.toUpperCase()}</div>
                <div className="pd-price">{formatPrice(product.price, i18n.language)}</div>

                <h3>{t('product_detail.specs_title')}</h3>
                <table className="pd-specs-table">
                    <tbody>
                        {product.category === 'prebuilt' && product.buildParts?.length > 0 ? (
                            product.buildParts.map((item, index) => {
                                const componentLabel = t(`specs.${item.component.toLowerCase()}`) !== `specs.${item.component.toLowerCase()}`
                                    ? t(`specs.${item.component.toLowerCase()}`)
                                    : item.component;

                                return (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold', color: 'var(--accent-color)', width: '200px' }}>
                                            {componentLabel}
                                        </td>
                                        <td>{item.name}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            product.specs && Object.entries(product.specs).map(([key, value]) => {
                                const label = i18n.exists(`specs.${key}`)
                                    ? t(`specs.${key}`)
                                    : key.replace(/_/g, ' ').toUpperCase();

                                return (
                                    <tr key={key}>
                                        <td style={{ fontWeight: 'bold' }}>{label}</td>
                                        <td>{value}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                <div className="pd-actions">
                    <button className="btn-main btn-cart" onClick={handleAddToCart}>
                        <FaShoppingCart className="btn-icon" /> {t('builder.add_all_cart').replace('Toàn bộ', '')}
                    </button>
                    {product.category !== 'prebuilt' && (
                        <button className="btn-main btn-builder" onClick={handleAddToBuilder}>
                            <FaWrench className="btn-icon" /> {t('selection.add_to_build')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;