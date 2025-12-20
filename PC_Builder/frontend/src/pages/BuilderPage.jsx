import { useBuilder } from '../context/BuilderContext';
import { formatCurrency } from '../utils/format'; // Hàm format tiền bạn đã làm lúc nãy

const BuilderPage = () => {
    const { buildState, totalPrice, addComponent, removeComponent } = useBuilder();

    const fakeCpu = {
        _id: "123",
        name: "Intel Core i9-13900K (Fake)",
        price: 15000000,
        category: "cpu",
        image: "https://via.placeholder.com/150"
    };

    return (
        <div>
            <h1>Xây dựng cấu hình PC</h1>

            <div style={{ background: '#f9f9f9', padding: '20px', marginBottom: '20px' }}>
                <h2>Cấu hình của bạn:</h2>
                <ul>
                    {Object.keys(buildState).length === 0 && <p>Chưa chọn linh kiện nào</p>}

                    {Object.entries(buildState).map(([category, product]) => (
                        <li key={category} style={{ marginBottom: '10px' }}>
                            <strong>{category.toUpperCase()}:</strong> {product.name} -
                            <span style={{ color: 'red', fontWeight: 'bold' }}> {formatCurrency(product.price)}</span>
                            <button
                                onClick={() => removeComponent(category)}
                                style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '5px' }}
                            >
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
                <h3>Tổng tiền: {formatCurrency(totalPrice)}</h3>
            </div>

            <button
                onClick={() => addComponent('cpu', fakeCpu)}
                style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                + Thử chọn CPU i9 (Test)
            </button>
        </div>
    );
};

export default BuilderPage;