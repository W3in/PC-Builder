import { createContext, useState, useContext } from 'react'; // Bỏ useEffect thừa
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('pc_user');
        return storedUser ? JSON.parse(storedUser) : null;
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
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginGoogle, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};