import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/format';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import FilterSidebar from '../components/product/FilterSidebar';
import FavoriteButton from '../components/product/FavoriteButton';
import { toast } from 'react-toastify';
import '../assets/styles/Selection.css';

const PreBuiltPage = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

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
                queryParams.append('limit', 12);

                Object.entries(filters).forEach(([key, values]) => {
                    if (values.length > 0) {
                        queryParams.append(key, values.join(','));
                    }
                });

                const { data } = await axiosClient.get(`/products?${queryParams.toString()}`);
                setProducts(data.products);
                setTotalPages(data.pages);
            } catch (error) {
                console.error("Lỗi tải danh sách PC:", error);
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
                    <h2>{t('home.prebuilt_section') || 'PC NGUYÊN BỘ (PRE-BUILT)'}</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {t('home.hero_prebuilt_desc')}
                    </p>
                </div>
            </div>

            <div className="selection-body" style={{ display: 'flex', gap: '30px' }}>
                {/* Sidebar bộ lọc */}
                <div style={{ width: '250px', flexShrink: 0 }}>
                    <FilterSidebar
                        category={category}
                        selectedFilters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Danh sách sản phẩm */}
                <div style={{ flexGrow: 1 }}>
                    <div className="products-grid">
                        {loading ? (
                            <p style={{ textAlign: 'center', width: '100%' }}>{t('selection.loading')}</p>
                        ) : products.length === 0 ? (
                            <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                                <h3>{t('selection.not_found')}</h3>
                                <p>{t('selection.not_found_desc')}</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <FavoriteButton productId={product._id} />
                                    <div className="card-img">
                                        <Link to={`/product/${product._id}`}
                                            style={{
                                                display: 'flex',
                                                width: '100%',
                                                height: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }} >
                                            <img src={getImageUrl(product.image)} alt={product.name} />
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {product.name}
                                            </Link>
                                        </h3>

                                        <div className="card-specs">
                                            {product.specs && Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                                                <span key={k} className="spec-badge">
                                                    {v}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="card-price">
                                            {formatPrice(product.price, i18n.language)}
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="btn-select"
                                                style={{ flex: 1 }}
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <FaShoppingCart /> {t('header.cart')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                                    onClick={() => {
                                        setPage(i + 1);
                                        window.scrollTo(0, 0);
                                    }}
                                >
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