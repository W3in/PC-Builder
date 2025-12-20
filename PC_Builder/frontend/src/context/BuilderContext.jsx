import { createContext, useState, useContext } from 'react';

// 1. Khởi tạo Context
const BuilderContext = createContext();

// 2. Tạo Provider (Nhà kho chứa dữ liệu)
export const BuilderProvider = ({ children }) => {
    // State lưu các linh kiện đã chọn
    // Cấu trúc sẽ là: { cpu: {name: "Core i5"...}, mainboard: {name: "Asus B660"...} }
    const [buildState, setBuildState] = useState({});

    // State lưu tổng tiền
    const [totalPrice, setTotalPrice] = useState(0);

    // Hàm chọn linh kiện
    const addComponent = (category, product) => {
        setBuildState((prev) => {
            const newState = { ...prev, [category]: product };

            // Tính lại tổng tiền ngay khi chọn
            calculateTotal(newState);
            return newState;
        });
    };

    // Hàm bỏ chọn linh kiện
    const removeComponent = (category) => {
        setBuildState((prev) => {
            const newState = { ...prev };
            delete newState[category]; // Xóa key đó đi

            calculateTotal(newState);
            return newState;
        });
    };

    // Hàm tính tổng tiền nội bộ
    const calculateTotal = (currentState) => {
        const total = Object.values(currentState).reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalPrice(total);
    };

    return (
        <BuilderContext.Provider value={{ buildState, totalPrice, addComponent, removeComponent }}>
            {children}
        </BuilderContext.Provider>
    );
};

// 3. Hook để các trang con gọi ra dùng cho nhanh
// eslint-disable-next-line react-refresh/only-export-components
export const useBuilder = () => {
    return useContext(BuilderContext);
};