import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../assets/styles/Auth.css';

const AuthPage = () => {
    const { t, i18n } = useTranslation();
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const { login, register, loginGoogle, user, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const redirectPath = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoginMode) {
            await login(email, password);
            toast.success(t('toast.login_success'));
            navigate(redirectPath, { replace: true });
        } else {
            await register(name, email, password, phone);
        }
    };


    return (
        <div className="auth-fullscreen">
            <div className="auth-overlay"></div>

            <div className="auth-container">
                <h2 className="auth-title">
                    {isLoginMode ? t('auth.login_title') : t('auth.register_title')}
                </h2>

                {error && <div className="error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder={t('auth.name_placeholder')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    placeholder={t('auth.phone_placeholder')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder={t('auth.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder={t('auth.password_placeholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth">
                        {isLoginMode ? t('auth.btn_login') : t('auth.btn_register')}
                    </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>

                    <div key={i18n.language}>
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                loginGoogle(credentialResponse.credential);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            theme="filled_blue"
                            size="large"
                            width="340"
                            shape="rectangular"

                            text={isLoginMode ? "signin_with" : "signup_with"}
                            locale={i18n.language}
                        />
                    </div>

                </div>

                <div className="auth-switch">
                    {isLoginMode ? t('auth.no_account') : t('auth.have_account')}
                    <span onClick={() => setIsLoginMode(!isLoginMode)}>
                        {isLoginMode ? t('auth.click_register') : t('auth.click_login')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;