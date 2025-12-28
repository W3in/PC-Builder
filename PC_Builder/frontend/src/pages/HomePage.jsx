import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { formatPrice, getImageUrl } from '../utils/format';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../assets/styles/Home.css';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axiosClient.get('/products');

                console.log("Dữ liệu từ Backend:", data);

                if (data.products) {
                    setProducts(data.products);
                } else if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Lỗi kết nối Backend:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="home-wrapper">
            <h1 className="home-title">
                {t('home.featured_products')}
            </h1>

            <div className="home-products-grid">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((p) => (
                        <div key={p._id} className="home-product-card">
                            <div className="product-img-wrapper">
                                <img src={getImageUrl(p.image)} alt={p.name} />
                            </div>

                            <h3 className="product-name" title={p.name}>
                                {p.name}
                            </h3>

                            <p className="product-price">
                                {formatPrice(p.price, i18n.language)}
                            </p>

                            <Link to="/builder" className="btn-build-now">
                                {t('home.build_now')}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="no-products">{t('home.no_products')}</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;