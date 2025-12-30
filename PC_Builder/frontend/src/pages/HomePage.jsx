import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaHeart, FaEye, FaComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';
import FavoriteButton from '../components/product/FavoriteButton';
import { formatPrice, getImageUrl } from '../utils/format';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../assets/styles/Home.css';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [recommended, setRecommended] = useState([]);
    const [preBuilt, setPreBuilt] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [resRec, resPre] = await Promise.all([
                    axiosClient.get('/products/recommendations'),
                    axiosClient.get('/products?category=prebuilt&limit=4')
                ]);
                setRecommended(resRec.data);
                setPreBuilt(resPre.data.products);
            } catch (err) { console.error(err); }
        };
        loadData();
    }, [user]);

    return (
        <div className="home-page">
            {/* 1. HERO SLIDER */}
            <section className="hero-slider">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    className="main-home-swiper"
                >
                    <SwiperSlide className="slide slide-build">
                        <div className="slide-overlay">
                            <div className="container">
                                <div className="slide-content-box">
                                    <h1>{t('home.hero_build_title')}</h1>
                                    <p>{t('home.hero_build_desc')}</p>
                                    <button onClick={() => navigate('/builder')} className="btn-hero">
                                        {t('home.build_now')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className="slide slide-prebuilt">
                        <div className="slide-overlay">
                            <div className="container">
                                <div className="slide-content-box">
                                    <h1>{t('home.hero_prebuilt_title')}</h1>
                                    <p>{t('home.hero_prebuilt_desc')}</p>
                                    <button onClick={() => navigate('/pre-built')} className="btn-hero-outline">
                                        {t('home.view_all')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </section>

            <section className="container section-margin">
                <div className="section-title">
                    <h2><FaHeart className="icon-red" /> {t('home.for_you')}</h2>
                </div>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                >
                    {recommended.map(product => (
                        <SwiperSlide key={product._id}>
                            <div className="home-card">
                                <FavoriteButton productId={product._id} />
                                <Link to={`/product/${product._id}`} className="home-card-img">
                                    <img src={getImageUrl(product.image)} alt="" />
                                </Link>
                                <div className="home-card-body">
                                    <h4>{product.name}</h4>
                                    <div className="home-card-price">{formatPrice(product.price, i18n.language)}</div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            <section className="build-guides-section">
                <div className="container build-guides-flex">
                    {/* Bên trái: Tiêu đề & Giới thiệu */}
                    <div className="guides-intro">
                        <h1>{t('home.prebuilt_section')}</h1>
                        <p>{t('home.pre_built_section_desc')}</p>
                        <button onClick={() => navigate('/prebuilt')} className="btn-view-guides">
                            <FaEye /> {t('home.view_all')}
                        </button>
                    </div>

                    {/* Bên phải: Danh sách Card */}
                    <div className="guides-grid">
                        {preBuilt.slice(0, 3).map(pc => (
                            <div key={pc._id} className="guide-card" onClick={() => navigate(`/product/${pc._id}`)}>
                                <div className="guide-card-top">
                                    <img className="main-pc-img" src={getImageUrl(pc.image)} alt="" />
                                </div>
                                <div className="guide-card-body">
                                    <h3>{pc.name}</h3>
                                    <ul className="parts-list">
                                        {pc.buildParts?.map((part, i) => (
                                            <li key={i}><span>{part.name}</span></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="guide-card-footer">
                                    <span className="guide-price">{formatPrice(pc.price, i18n.language)}</span>
                                    <span className="guide-comments"><FaComment /> 59</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;