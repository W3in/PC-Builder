import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaTrash, FaPlus, FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';
import '../../assets/styles/Admin.css';

import { FILTER_OPTIONS } from '../../utils/filterOptions';

const CATEGORY_TEMPLATES = {
    cpu: ['socket', 'cores', 'threads', 'base_clock', 'boost_clock', 'tdp', 'series'],
    mainboard: ['socket', 'chipset', 'form_factor', 'ram_type', 'ram_slots', 'max_ram', 'm2_slots', 'pci_slots'],
    ram: ['type', 'capacity', 'bus', 'cas_latency'],
    gpu: ['chipset', 'series', 'vram', 'boost_clock', 'length'],
    psu: ['wattage', 'efficiency', 'modular'],
    case: ['form_factor', 'side_panel_type', 'max_gpu_length'],
    storage: ['type', 'capacity', 'interface', 'read_speed', 'write_speed'],
    cooler: ['type', 'socket_support', 'fan_speed', 'size', 'color', 'noise_level'],
    prebuilt: []
};

const COMPONENT_TYPES = [
    { label: 'Vi xử lý', value: 'cpu' },
    { label: 'Bo mạch chủ', value: 'mainboard' },
    { label: 'RAM', value: 'ram' },
    { label: 'Card đồ họa', value: 'gpu' },
    { label: 'Nguồn máy tính', value: 'psu' },
    { label: 'Vỏ máy tính', value: 'case' },
    { label: 'SSD', value: 'ssd' },
    { label: 'HDD', value: 'hdd' },
    { label: 'Tản nhiệt', value: 'cooler' },
    { label: 'Màn hình', value: 'monitor' }
];

const ProductEditPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();

    // State cơ bản
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('cpu');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [usage, setUsage] = useState('gaming');

    const [specs, setSpecs] = useState({});
    const [manualFields, setManualFields] = useState({});
    const [isBrandManual, setIsBrandManual] = useState(false);

    const [buildParts, setBuildParts] = useState([{ component: '', name: '' }]);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axiosClient.get(`/products/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    setImage(data.image);
                    setBrand(data.brand);
                    setCategory(data.category);
                    setCountInStock(data.countInStock);
                    setDescription(data.description || '');
                    setSpecs(data.specs || {});
                    setUsage(data.usage || 'gaming');
                    if (data.buildParts && data.buildParts.length > 0) {
                        setBuildParts(data.buildParts);
                    } else {
                        setBuildParts([{ component: '', name: '' }]);
                    }
                } catch (error) {
                    toast.error("Không thể tải thông tin sản phẩm");
                    navigate('/admin/products');
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode, navigate]);

    const handleAddPart = () => setBuildParts([...buildParts, { component: '', name: '' }]);

    const handleRemovePart = (index) => {
        const newParts = buildParts.filter((_, i) => i !== index);
        setBuildParts(newParts.length > 0 ? newParts : [{ component: '', name: '' }]);
    };

    const handlePartChange = (index, field, value) => {
        const newParts = [...buildParts];
        newParts[index][field] = value;
        setBuildParts(newParts);
    };

    // 3. Các hàm xử lý Specs (giữ nguyên logic của bạn)
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSpecs({});
        setManualFields({});
        if (e.target.value !== 'prebuilt') {
            setBuildParts([{ component: '', name: '' }]);
        }
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

    // 4. Upload File
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

    // 5. Submit Form (Create hoặc Update)
    const submitHandler = async (e) => {
        e.preventDefault();

        const productData = {
            name, price, image, brand, category, description, countInStock,
            specs: category === 'prebuilt' ? {} : specs,
            buildParts: category === 'prebuilt' ? buildParts : [],
            usage: category === 'prebuilt' ? usage : undefined,
        };

        try {
            if (isEditMode) {
                await axiosClient.put(`/products/${id}`, productData);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await axiosClient.post('/products', productData);
                toast.success('Tạo sản phẩm thành công');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi xử lý dữ liệu');
        }
    };

    const currentSpecFields = CATEGORY_TEMPLATES[category] || [];
    const brandOptions = getBrandOptions();

    return (
        <div className="product-edit-wrapper">
            <div className="edit-header-box">
                <button onClick={() => navigate('/admin/products')} className="btn-back-admin">
                    <FaArrowLeft /> Quay lại
                </button>
                <h1 className="edit-title">{isEditMode ? `Chỉnh sửa: ${name}` : 'Thêm sản phẩm mới'}</h1>
            </div>

            <form onSubmit={submitHandler} className="edit-form-grid">


                <div className="form-section">
                    <h3 className="form-section-title">Thông tin cơ bản</h3>

                    <div className="form-control">
                        <label className="form-label">Tên sản phẩm</label>
                        <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="form-control">
                        <label className="form-label">Giá niêm yết (VND)</label>
                        <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="form-control">
                        <label className="form-label">Hình ảnh sản phẩm</label>
                        <div className="upload-group">
                            <input type="text" className="form-input" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Đường dẫn ảnh..." style={{ marginBottom: '10px' }} />
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '14px' }}>
                                <FaUpload /> Tải ảnh lên
                                <input type="file" hidden onChange={uploadFileHandler} />
                            </label>
                        </div>
                        {uploading && <small>Đang xử lý...</small>}
                        {image && (
                            <div className="edit-preview-box">
                                <img src={image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL.replace('/api', '')}${image}`} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="form-label">Danh mục</label>
                        <select className="form-select" value={category} onChange={handleCategoryChange}>
                            {Object.keys(CATEGORY_TEMPLATES).map(c => (
                                <option key={c} value={c}>{c.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="form-label">Thương hiệu (Brand)</label>
                        <div className="spec-input-group">
                            {brandOptions && !isBrandManual ? (
                                <select className="form-select" value={brand} onChange={(e) => setBrand(e.target.value)} required>
                                    <option value="">-- Chọn --</option>
                                    {brandOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input type="text" className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Nhập hãng..." required />
                            )}
                            <button type="button" className="btn-toggle-input" onClick={() => { setIsBrandManual(!isBrandManual); setBrand(''); }}>
                                {isBrandManual ? "Dùng List" : "Gõ tay"}
                            </button>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="form-label">Số lượng tồn kho</label>
                        <input type="number" className="form-input" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                    </div>
                </div>

                <div className="form-section">
                    {category === 'prebuilt' ? (
                        <div className="form-section-full">
                            {/* --- PHẦN USAGE MỚI THÊM VÀO ĐÂY --- */}
                            <h3 className="form-section-title">Cấu hình máy bộ</h3>

                            <div className="form-control" style={{ marginBottom: '20px' }}>
                                <label className="form-label" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                                    Nhu cầu sử dụng chính
                                </label>
                                <select
                                    className="form-select"
                                    value={usage}
                                    onChange={(e) => setUsage(e.target.value)}
                                >
                                    <option value="office">Văn phòng - Học tập</option>
                                    <option value="gaming">Gaming / Trò chơi</option>
                                    <option value="streaming">Live Stream </option>
                                    <option value="workstation">Đồ họa chuyên nghiệp</option>
                                </select>
                            </div>

                            <h3 className="form-section-title">Danh sách linh kiện lắp sẵn (Build Parts)</h3>
                            <div className="build-parts-container">
                                {buildParts.map((part, index) => (
                                    <div key={index} className="build-part-row">
                                        <select
                                            className="form-select-sm"
                                            style={{ flex: '0 0 150px' }}
                                            value={part.component}
                                            onChange={(e) => handlePartChange(index, 'component', e.target.value)}
                                        >
                                            <option value="">-- Loại --</option>
                                            {COMPONENT_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>

                                        <input
                                            placeholder="Tên sản phẩm (VD: Core i9-13900K)"
                                            className="form-input-sm"
                                            value={part.name}
                                            onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                                        />

                                        <button type="button" className="btn-remove-part" onClick={() => handleRemovePart(index)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn-add-part" onClick={handleAddPart}>
                                    <FaPlus /> Thêm linh kiện mới
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="form-section-title">Thông số kỹ thuật chi tiết</h3>
                            <div className="specs-grid-scroll">
                                {currentSpecFields.map((field) => {
                                    const options = getOptionsForSpec(field);
                                    const isManual = manualFields[field];
                                    return (
                                        <div key={field} className="form-control">
                                            <label className="form-label-small">{field.toUpperCase()}:</label>
                                            <div className="spec-input-group">
                                                {options && !isManual ? (
                                                    <select className="form-select-sm" value={specs[field] || ''} onChange={(e) => handleSpecChange(field, e.target.value)}>
                                                        <option value="">-- Chọn --</option>
                                                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                ) : (
                                                    <input type="text" className="form-input-sm" value={specs[field] || ''} onChange={(e) => handleSpecChange(field, e.target.value)} />
                                                )}
                                                {options && (
                                                    <button type="button" className="btn-toggle-input-sm" onClick={() => toggleManualInput(field)}>
                                                        {isManual ? "List" : "Tay"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="form-control" style={{ marginTop: '20px' }}>
                        <label className="form-label">Mô tả sản phẩm</label>
                        <textarea className="form-textarea" rows="6" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả sản phẩm..."></textarea>
                    </div>
                </div>

                <button type="submit" className="btn-submit-full">
                    <FaSave /> {isEditMode ? 'CẬP NHẬT SẢN PHẨM' : 'XÁC NHẬN TẠO MỚI'}
                </button>
            </form>
        </div>
    );
};

export default ProductEditPage;