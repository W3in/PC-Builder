import { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('pc_user');
            if (!storedUser || storedUser === "undefined") return null;
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Lỗi đọc user từ LocalStorage:", error);
            localStorage.removeItem('pc_user');
            return null;
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const { data } = await axiosClient.post('/users/login', { email, password });
            setUser(data);
            localStorage.setItem('pc_user', JSON.stringify(data));
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginGoogle = async (googleToken) => {
        setError(null);
        setLoading(true);
        try {
            // Gửi token sang backend xác thực
            const { data } = await axiosClient.post('/users/google', { googleToken });

            setUser(data);
            localStorage.setItem('pc_user', JSON.stringify(data));
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập Google thất bại");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Hàm Đăng ký
    const register = async (name, email, password, phone) => {
        setError(null);
        setLoading(true);
        try {
            const { data } = await axiosClient.post('/users/register', { name, email, password, phone });
            setUser(data);
            localStorage.setItem('pc_user', JSON.stringify(data));
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Hàm Đăng xuất
    const logout = () => {
        localStorage.removeItem('pc_user');
        setUser(null);
        setFavorites([]);
        navigate('/');
    };

    useEffect(() => {
        const fetchFavoriteIds = async () => {
            if (user && user.token) {
                try {
                    const { data } = await axiosClient.get('/users/favorites/ids');
                    setFavorites(data);
                } catch (err) {
                    console.error("Không thể lấy danh sách yêu thích", err);
                }
            } else {
                setFavorites([]);
            }
        };
        fetchFavoriteIds();
    }, [user]);

    const toggleFavorite = async (productId) => {
        if (!user) return false;
        try {
            const { data } = await axiosClient.post('/users/favorites', { productId });
            setFavorites(data.favorites);
            return true;
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, loginGoogle, register, logout, loading, error, favorites, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};