import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/Admin.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');

    const openDeleteModal = (id) => {
        setTargetId(id);
        setShowModal(true);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get(`/products?page=${page}&keyword=${keyword}&limit=20`);
            setProducts(data.products);
            setPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosClient.delete(`/products/${targetId}`);
            toast.success('Xóa thành công');
            setShowModal(false);
            setTargetId(null);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa");
            setShowModal(false);
        }
    };
    return (
        <div className="admin-container">
            <div className="product-list-header">
                <h1>Quản lý Sản phẩm</h1>

                <form className="admin-search-form" onSubmit={handleSearch}>
                    <div className="search-input-group">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm tên linh kiện, máy bộ..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            <FaSearch />
                        </button>
                    </div>
                </form>

                <Link to="/admin/product/create" className="btn-add-product">
                    <FaPlus /> Thêm sản phẩm
                </Link>
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Danh mục</th>
                                <th>Hãng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id.substring(0, 10)}...</td>
                                    <td>{product.name}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td style={{
                                        fontWeight: 'bold',
                                        color: product.countInStock > 0 ? 'green' : 'red'
                                    }}>
                                        {product.countInStock}
                                    </td>
                                    <td style={{ textTransform: 'uppercase' }}>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Link to={`/admin/product/${product._id}/edit`} className="btn-edit-small">
                                                <FaEdit />
                                            </Link>
                                            <button className="btn-remove" onClick={() => openDeleteModal(product._id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pages > 1 && (
                        <div className="pagination">
                            {[...Array(pages).keys()].map((x) => (
                                <button
                                    key={x + 1}
                                    className={`page-btn ${x + 1 === page ? 'active' : ''}`}
                                    onClick={() => setPage(x + 1)}
                                >
                                    {x + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Xác nhận xóa</h3>
                        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                            <button className="btn-confirm-delete" onClick={handleConfirmDelete}>Xóa ngay</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;