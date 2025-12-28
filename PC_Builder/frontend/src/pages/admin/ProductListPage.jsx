import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../assets/styles/Admin.css';

const ProductListPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
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

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axiosClient.delete(`/products/${id}`, config);
                toast.success('Xóa thành công');
                fetchProducts();
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
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
                                    <button className="btn-remove" onClick={() => handleDelete(product._id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductListPage;