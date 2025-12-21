import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
function App() {
  const { i18n } = useTranslation();
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      key={i18n.language}
    >
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>

            <Route index element={<HomePage />} />

            <Route path="builder" element={<BuilderPage />} />

            <Route path="cart" element={<CartPage />} />

            <Route path="login" element={<AuthPage />} />

            <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />

          </Route>
        </Routes>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;