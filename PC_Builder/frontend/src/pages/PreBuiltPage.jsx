import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/format';
import { FaShoppingCart, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../components/product/FavoriteButton';
import FilterSidebar from '../components/product/FilterSidebar';
import { toast } from 'react-toastify';
import '../assets/styles/Selection.css';

const PreBuiltPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ usage: [], price_range: [] });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const category = 'prebuilt';

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const currentValues = prev[key] || [];
            if (currentValues.includes(value)) {
                return { ...prev, [key]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...currentValues, value] };
            }
        });
        setPage(1);
    };

    useEffect(() => {
        const fetchPreBuiltPCs = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                queryParams.append('category', category);
                queryParams.append('page', page);

                if (filters.price_range.length > 0) {
                    const range = filters.price_range[0];
                    if (range === 'under_15m') {
                        queryParams.append('maxPrice', '15000000');
                    } else if (range === 'range_15_30m') {
                        queryParams.append('minPrice', '15000000');
                        queryParams.append('maxPrice', '30000000');
                    } else if (range === 'above_30m') {
                        queryParams.append('minPrice', '30000000');
                    }
                }

                if (filters.usage.length > 0) {
                    queryParams.append('usage', filters.usage.join(','));
                }

                const { data } = await axiosClient.get(`/products?${queryParams.toString()}`);
                setProducts(data.products);
                setTotalPages(data.pages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPreBuiltPCs();
    }, [page, filters]);


    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(t('toast.add_cart_success', { name: product.name }));
    };

    return (
        <div className="selection-wrapper">
            <div className="selection-header">
                <button onClick={() => navigate('/')} className="back-btn">
                    <FaArrowLeft /> {t('selection.back')}
                </button>
                <div className="header-info">
                    <h2>{t('home.prebuilt_section')}</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {t('home.pre_built_section_desc')}
                    </p>
                </div>
            </div>

            <div className="selection-body" style={{ display: 'flex', gap: '30px' }}>
                <div style={{ width: '250px', flexShrink: 0 }}>
                    <FilterSidebar
                        category={category}
                        selectedFilters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <div style={{ flexGrow: 1 }}>
                    <div className="products-grid">
                        {loading ? (
                            <p style={{ textAlign: 'center', width: '100%' }}>{t('selection.loading')}</p>
                        ) : (
                            products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <FavoriteButton productId={product._id} />
                                    {product.usage && (
                                        <div className={`usage-ribbon ${product.usage}`}>
                                            {t(`filters.options.${product.usage}`)}
                                        </div>
                                    )}

                                    <div className="card-img">
                                        <Link to={`/product/${product._id}`} style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={getImageUrl(product.image)} alt={product.name} />
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {product.name}
                                            </Link>
                                        </h3>

                                        <div className="card-parts-summary">
                                            {product.buildParts?.slice(0, 3).map((part, i) => (
                                                <div key={i} className="mini-part-item">
                                                    <FaCheckCircle size={10} color="var(--accent-color)" />
                                                    <span>{part.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="card-price">
                                            {formatPrice(product.price, i18n.language)}
                                        </div>

                                        <button className="btn-select" onClick={() => handleAddToCart(product)}>
                                            <FaShoppingCart /> {t('header.cart')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreBuiltPage;