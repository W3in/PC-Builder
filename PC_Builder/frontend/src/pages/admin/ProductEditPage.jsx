import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../../assets/styles/Admin.css';

import { FILTER_OPTIONS } from '../../utils/filterOptions';

const CATEGORY_TEMPLATES = {
    cpu: ['socket', 'cores', 'threads', 'base_clock', 'boost_clock', 'tdp', 'series', 'integrated_gpu'],
    mainboard: ['socket', 'chipset', 'form_factor', 'ram_type', 'ram_slots', 'max_ram', 'm2_slots', 'pci_slots'],
    ram: ['type', 'capacity', 'bus', 'cas_latency'],
    gpu: ['chipset', 'series', 'vram', 'boost_clock', 'length'],
    psu: ['wattage', 'efficiency', 'modular'],
    case: ['form_factor', 'side_panel_type', 'max_gpu_length'],
    storage: ['type', 'capacity', 'interface', 'read_speed', 'write_speed'],
    cooler: ['type', 'socket_support', 'fan_speed', 'size', 'color', 'noise_level']
};

const ProductEditPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('cpu');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const [specs, setSpecs] = useState({});
    const [manualFields, setManualFields] = useState({});

    const [isBrandManual, setIsBrandManual] = useState(false);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSpecs({});
        setManualFields({});
        setBrand('');
        setIsBrandManual(false);
    };

    const handleSpecChange = (key, value) => {
        setSpecs(prev => ({ ...prev, [key]: value }));
    };

    const toggleManualInput = (key) => {
        setManualFields(prev => ({ ...prev, [key]: !prev[key] }));
        handleSpecChange(key, '');
    };

    const getOptionsForSpec = (specKey) => {
        const categoryFilters = FILTER_OPTIONS[category];
        if (!categoryFilters) return null;
        const filterItem = categoryFilters.find(f => f.key === specKey);
        return filterItem ? filterItem.options : null;
    };

    const getBrandOptions = () => {
        const categoryFilters = FILTER_OPTIONS[category];
        if (!categoryFilters) return null;
        const brandFilter = categoryFilters.find(f => f.key === 'brand');
        return brandFilter ? brandFilter.options : null;
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
            const { data } = await axios.post(`${backendUrl}/api/upload`, formData);
            setImage(data);
            setUploading(false);
            toast.success("Upload ảnh thành công!");
        } catch (error) {
            setUploading(false);
            toast.error("Lỗi upload ảnh");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/products', {
                name, price, image, brand, category, description, countInStock, specs
            });
            toast.success('Tạo sản phẩm thành công');
            navigate('/admin/products');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Lỗi tạo sản phẩm';
            console.error(errorMsg);
            toast.error(errorMsg);
        }
    };

    const currentSpecFields = CATEGORY_TEMPLATES[category] || [];
    const brandOptions = getBrandOptions();

    return (
        <div className="product-edit-wrapper">
            <h1 className="edit-title">Thêm sản phẩm mới</h1>

            <form onSubmit={submitHandler} className="edit-form-grid">

                <div className="form-section">
                    <h3 className="form-section-title">Thông tin chung</h3>

                    <div className="form-control">
                        <label className="form-label">Tên sản phẩm</label>
                        <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="form-control">
                        <label className="form-label">Giá (VND)</label>
                        <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="form-control">
                        <label className="form-label">Hình ảnh</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <input type="text" className="form-input" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Link ảnh hoặc upload" />
                            <input type="file" onChange={uploadFileHandler} />
                            {uploading && <small className="loading-text">Đang upload...</small>}
                            {image && (
                                <div className="preview-box">
                                    <img
                                        src={image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL.replace('/api', '')}${image}`}
                                        alt="Preview" className="preview-img" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-control">
                        <div className="form-control">
                            <label className="form-label">Danh mục</label>
                            <select className="form-select" value={category} onChange={handleCategoryChange}>
                                {['cpu', 'mainboard', 'ram', 'gpu', 'psu', 'storage', 'case', 'cooler'].map(c => (
                                    <option key={c} value={c}>{c.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <label className="form-label">Hãng (Brand)</label>

                        <div className="spec-input-group">
                            {brandOptions && !isBrandManual ? (
                                <select
                                    className="form-select"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    required
                                >
                                    <option value="">-- Chọn Hãng --</option>
                                    {brandOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className="form-input"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    placeholder="Nhập tên hãng..."
                                    required
                                />
                            )}
                            <button
                                type="button"
                                className="btn-toggle-input"
                                onClick={() => {
                                    setIsBrandManual(!isBrandManual);
                                    setBrand('');
                                }}
                            >
                                {isBrandManual ? "Chọn List" : "Nhập tay"}
                            </button>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="form-label">Tồn kho</label>
                        <input type="number" className="form-input" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                    </div>
                </div>
                <div className="form-section">
                    <h3 className="form-section-title">Thông số kỹ thuật ({category.toUpperCase()})</h3>

                    {currentSpecFields.length > 0 ? (
                        currentSpecFields.map((field) => {
                            const options = getOptionsForSpec(field);
                            const isManual = manualFields[field];

                            return (
                                <div key={field} className="form-control">
                                    <label className="form-label">{field.replace(/_/g, ' ')}:</label>

                                    <div className="spec-input-group">
                                        {options && !isManual ? (
                                            <select
                                                className="form-select"
                                                value={specs[field] || ''}
                                                onChange={(e) => handleSpecChange(field, e.target.value)}
                                            >
                                                <option value="">-- Chọn --</option>
                                                {options.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={specs[field] || ''}
                                                onChange={(e) => handleSpecChange(field, e.target.value)}
                                                placeholder={`Nhập ${field}...`}
                                            />
                                        )}

                                        {options && (
                                            <button
                                                type="button"
                                                className="btn-toggle-input"
                                                onClick={() => toggleManualInput(field)}
                                            >
                                                {isManual ? "Chọn List" : "Nhập tay"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="empty-text">Chưa có mẫu thông số cho danh mục này.</p>
                    )}

                    <div className="form-control" style={{ marginTop: 'auto' }}>
                        <label className="form-label">Mô tả thêm</label>
                        <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                </div>

                <button type="submit" className="btn-submit">
                    TẠO SẢN PHẨM
                </button>
            </form>
        </div>
    );
};

export default ProductEditPage;