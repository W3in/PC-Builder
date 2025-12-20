import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi kết nối Backend:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Danh sách linh kiện</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {products.map((p) => (
                    <div key={p._id} style={{ border: '1px solid #ddd', padding: '10px', width: '200px' }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <h3>{p.name}</h3>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>{p.price.toLocaleString()} đ</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;