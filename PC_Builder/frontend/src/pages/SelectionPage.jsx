import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useBuilder } from '../context/BuilderContext';
import { formatPrice, getImageUrl } from '../utils/format';
import { FaPlus, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import FilterSidebar from '../components/product/FilterSidebar';
import '../assets/styles/Selection.css';

const SelectionPage = () => {
    const { t, i18n } = useTranslation();
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const budgetParam = searchParams.get('budget');
    const recommendedBudget = budgetParam ? Number(budgetParam) : null;

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addComponent } = useBuilder();
    const currentSlot = searchParams.get('slot') || category;
    const navigate = useNavigate();

    const [filters, setFilters] = useState({});

    let categoryLabel = '';

    if (i18n.exists(`category.${category}`)) {
        categoryLabel = t(`category.${category}`);
    } else if (i18n.exists(`subcategory.${category}`)) {
        categoryLabel = t(`subcategory.${category}`);
    } else if (i18n.exists(`builder.slots.${category}`)) {
        categoryLabel = t(`builder.slots.${category}`);
    } else {
        categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    }


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
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                queryParams.append('category', category);
                queryParams.append('page', page);
                queryParams.append('limit', 15);

                Object.entries(filters).forEach(([key, values]) => {
                    if (values.length > 0) {
                        queryParams.append(key, values.join(','));
                    }
                });

                const { data } = await axiosClient.get(`/products?${queryParams.toString()}`);

                setProducts(data.products);
                setTotalPages(data.pages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, page, filters]);

    const handleSelect = (product) => {
        addComponent(currentSlot, product);
        navigate('/builder');
    };

    return (
        <div className="selection-wrapper">
            <div className="selection-header">
                <button onClick={() => navigate('/builder')} className="back-btn">
                    <FaArrowLeft /> {t('selection.back')}
                </button>
                <div className="header-info">
                    <h2>{t('builder.btn_choose')} {categoryLabel}</h2>
                    {recommendedBudget > 0 && (
                        <p style={{ fontSize: '14px', color: '#888' }}>
                            {t('selection.budget_hint')}:
                            <span className="highlight" style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                                {formatPrice(recommendedBudget, i18n.language)}
                            </span>
                        </p>
                    )}
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
                        ) : products.length === 0 ? (
                            <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                                <h3>{t('selection.not_found')}</h3>
                                <p>{t('selection.not_found_desc')}</p>
                            </div>
                        ) : (
                            products.map((product) => {
                                const isOverBudget = recommendedBudget > 0 && product.price > recommendedBudget * 1.2;

                                return (
                                    <div key={product._id} className={`product-card ${isOverBudget ? 'over-price' : ''}`}>
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
                                                        {k}: {v}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="card-price">
                                                {formatPrice(product.price, i18n.language)}
                                            </div>

                                            <button className="btn-select" onClick={() => handleSelect(product)}>
                                                <FaPlus /> {t('selection.add_to_build')}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(i + 1)}
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

export default SelectionPage;