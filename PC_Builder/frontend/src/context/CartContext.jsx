import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('pc_cart');
            if (!stored || stored === "undefined") return [];
            return JSON.parse(stored);
        } catch (error) {
            console.error("Lỗi đọc cart từ LocalStorage:", error);
            localStorage.removeItem('pc_cart');
            return [];
        }
    });

    const [coupon, setCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        localStorage.setItem('pc_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existItem = prev.find(item => item._id === product._id);
            if (existItem) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const addToCartBatch = (products) => {
        setCartItems(prev => {
            const newItems = products.map(p => ({ ...p, qty: 1 }));
            return [...prev, ...newItems];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const finalTotal = subTotal - discountAmount;

    const applyCoupon = (code) => {
        if (code === 'PCBUILDER10') {
            setDiscountAmount(subTotal * 0.1);
            setCoupon(code);
            return { success: true, msg: "Áp dụng mã giảm 10% thành công!" };
        }
        return { success: false, msg: "Mã giảm giá không hợp lệ" };
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, addToCartBatch, removeFromCart, subTotal, finalTotal, applyCoupon, discountAmount }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);