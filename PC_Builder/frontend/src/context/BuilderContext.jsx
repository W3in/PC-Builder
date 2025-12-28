import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
    const { user } = useAuth();
    const [buildState, setBuildState] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const getBuilderKey = () => {
        return user && user._id ? `pc_build_${user._id}` : 'pc_build_guest';
    };
    const addComponent = (category, product) => {
        setBuildState((prev) => {
            const newState = { ...prev, [category]: product };


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

    // Hàm thay đổi số lượng linh kiện (Dành cho RAM, GPU...)
    const updateQuantity = (product, currentSlotKeys, type, change) => {
        setBuildState((prev) => {
            const newState = { ...prev };

            if (change > 0) {
                let emptySlotKey = null;
                for (let i = 0; i < 8; i++) {
                    const key = `${type}_${i}`;
                    if (!newState[key]) {
                        emptySlotKey = key;
                        break;
                    }
                }

                if (emptySlotKey) {
                    newState[emptySlotKey] = product;
                } else {
                    alert("Không còn khe cắm trống cho linh kiện này!");
                }

            } else {
                if (currentSlotKeys.length > 0) {
                    const lastKey = currentSlotKeys[currentSlotKeys.length - 1];
                    delete newState[lastKey];
                }
            }

            calculateTotal(newState);
            return newState;
        });
    };

    useEffect(() => {
        const key = getBuilderKey();
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsedBuild = JSON.parse(stored);
                setBuildState(parsedBuild);
                calculateTotal(parsedBuild);
            } else {
                setBuildState({});
                setTotalPrice(0);
            }
        } catch (error) {
            setBuildState({});
        }
    }, [user]);

    useEffect(() => {
        const key = getBuilderKey();
        localStorage.setItem(key, JSON.stringify(buildState));
    }, [buildState, user]);

    return (
        <BuilderContext.Provider value={{ buildState, totalPrice, addComponent, removeComponent, updateQuantity }}>
            {children}
        </BuilderContext.Provider>
    );
};

// 3. Hook để các trang con gọi ra dùng cho nhanh
// eslint-disable-next-line react-refresh/only-export-components
export const useBuilder = () => {
    return useContext(BuilderContext);
};