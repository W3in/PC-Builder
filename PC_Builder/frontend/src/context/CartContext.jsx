import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, loading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const getCartKey = (currentUser) => {
        return currentUser && currentUser._id ? `pc_cart_${currentUser._id}` : 'pc_cart_guest';
    };


    useEffect(() => {
        if (loading) return;

        const guestKey = 'pc_cart_guest';
        const guestData = localStorage.getItem(guestKey);
        const guestItems = guestData ? JSON.parse(guestData) : [];

        if (user && user._id) {
            const userKey = `pc_cart_${user._id}`;
            const userStored = localStorage.getItem(userKey);
            let userItems = userStored ? JSON.parse(userStored) : [];

            if (guestItems.length > 0) {
                const mergedItems = [...userItems];
                guestItems.forEach(gItem => {
                    const exist = mergedItems.find(uItem => uItem._id === gItem._id);
                    if (exist) {
                        exist.qty += gItem.qty;
                    } else {
                        mergedItems.push(gItem);
                    }
                });

                setCartItems(mergedItems);
                localStorage.removeItem(guestKey);
                localStorage.setItem(userKey, JSON.stringify(mergedItems));
            } else {
                setCartItems(userItems);
            }
        } else {
            setCartItems(guestItems);
        }

        setIsLoaded(true);
    }, [user, loading]);

    useEffect(() => {
        if (!isLoaded) return;
        const key = getCartKey(user);
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems, user, isLoaded]);

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

    const decreaseQty = (id) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item._id === id) {
                    return { ...item, qty: Math.max(1, item.qty - 1) };
                }
                return item;
            });
        });
    };

    const addToCartBatch = (products) => {
        setCartItems((prev) => {
            let newCart = prev.map(item => ({ ...item }));

            products.forEach((productFromBuilder) => {
                const existingIndex = newCart.findIndex((item) => item._id === productFromBuilder._id);

                if (existingIndex > -1) {
                    newCart[existingIndex].qty += 1;
                } else {
                    newCart.push({ ...productFromBuilder, qty: 1 });
                }
            });

            return newCart;
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

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(getCartKey());
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, addToCartBatch, removeFromCart, decreaseQty, clearCart, subTotal, finalTotal, applyCoupon, discountAmount }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);