import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/format';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, loading } = useAuth();
    const { t, i18n } = useTranslation();
    const [cartItems, setCartItems] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
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

    const applyCoupon = (couponData) => {
        if (!couponData) {
            setAppliedCoupon(null);
            setDiscountAmount(0);
            return { success: false, msg: t('coupon.remove_success') };
        }

        if (subTotal < couponData.minOrderValue) {
            const requiredAmount = formatPrice(couponData.minOrderValue, i18n.language);
            return {
                success: false,
                msg: t('coupon.min_order_error', { amount: requiredAmount })
            };
        }
        let calculatedDiscount = 0;

        if (couponData.discountType === 'percent') {
            calculatedDiscount = (subTotal * couponData.discountValue) / 100;
            if (couponData.maxDiscountAmount > 0 && calculatedDiscount > couponData.maxDiscountAmount) {
                calculatedDiscount = couponData.maxDiscountAmount;
            }
        } else if (couponData.discountType === 'fixed') {
            calculatedDiscount = couponData.discountValue;
        }

        if (calculatedDiscount > subTotal) calculatedDiscount = subTotal;

        setDiscountAmount(calculatedDiscount);
        setAppliedCoupon(couponData);

        return {
            success: true,
            msg: t('coupon.apply_success', { code: couponData.code })
        };
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
        setDiscountAmount(0);
        const key = user && user._id ? `pc_cart_${user._id}` : 'pc_cart_guest';
        localStorage.removeItem(key);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, addToCartBatch, removeFromCart, decreaseQty, clearCart, subTotal, finalTotal, applyCoupon, appliedCoupon, discountAmount }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);