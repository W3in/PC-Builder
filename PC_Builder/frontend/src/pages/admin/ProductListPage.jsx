import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/Admin.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const openDeleteModal = (id) => {
        setTargetId(id);
        setShowModal(true);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/products?limit=1000');
            setProducts(data.products || data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleConfirmDelete = async () => {
        try {
            await axiosClient.delete(`/products/${targetId}`);
            toast.success('Xóa thành công');

            // Đóng modal và reset ID
            setShowModal(false);
            setTargetId(null);

            // Cập nhật lại danh sách (fetch lại hoặc lọc state)
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
                <Link to="/admin/product/create" className="btn-add-product">
                    <FaPlus /> Thêm sản phẩm
                </Link>
            </div>

            {loading ? <p>Loading...</p> : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Giá</th>
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
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                            className="btn-edit-small"
                                            title="Chỉnh sửa"
                                        >
                                            <FaEdit />
                                        </Link>

                                        <button
                                            className="btn-remove"
                                            onClick={() => openDeleteModal(product._id)}
                                            title="Xóa"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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