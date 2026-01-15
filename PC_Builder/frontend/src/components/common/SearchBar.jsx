import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSpinner, FaTimes, FaFire } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../../hooks/useDebounce';
import axiosClient from '../../api/axiosClient';
import '../../assets/styles/SearchBar.css';
import { formatPrice, getImageUrl } from '../../utils/format';

const SearchBar = () => {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearchQuery.trim()) {
                setSearchResults([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await axiosClient.get(`/products/suggestions?keyword=${debouncedSearchQuery}`);
                if (response.data && Array.isArray(response.data)) {
                    setSearchResults(response.data);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearchQuery]);

    useEffect(() => {
        if (searchQuery) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [searchQuery]);

    const handleResultClick = (productId) => {
        setIsOpen(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            setIsOpen(false);
        }
    };

    return (
        <div className="custom-search-container" ref={containerRef}>
            <div className={`search-input-wrapper ${isOpen ? 'active' : ''}`}>
                <FaSearch className="search-icon-input" />
                <input
                    type="text"
                    placeholder={t('header.search_placeholder') || "Search..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setIsOpen(true)}
                    onKeyDown={handleEnterKey}
                    className="custom-search-input"
                />
                {isLoading && <FaSpinner className="search-spinner" />}
                {searchQuery && !isLoading && (
                    <FaTimes
                        className="search-clear"
                        onClick={() => { setSearchQuery(''); setIsOpen(false); }}
                    />
                )}
            </div>

            {isOpen && (isLoading || searchResults.length > 0) && (
                <div className="search-dropdown">
                    {!isLoading && searchResults.length === 0 ? (
                        <div className="no-results">
                            {t('common.no_results') || "No results found"}
                        </div>
                    ) : (
                        <div className="results-list">
                            <div className="dropdown-header">
                                <span>{t('header.suggestions') || "Gợi ý sản phẩm"}</span>
                            </div>
                            {searchResults.map((product) => (
                                <div
                                    key={product._id}
                                    className="search-item"
                                    onClick={() => handleResultClick(product._id)}
                                >
                                    <div className="item-image-box">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                            }}
                                        />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-name" title={product.name}>
                                            {product.name}
                                        </div>
                                        <div className="item-meta">
                                            <span className="item-price">
                                                {formatPrice(product.price, i18n.language)}
                                            </span>

                                            {product.category && (
                                                <span className="item-badge">{product.category}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;