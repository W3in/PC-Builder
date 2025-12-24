import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SelectionPage from './pages/SelectionPage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoon from './pages/ComingSoon';
import IntroScreen from './components/common/IntroScreen';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  const { i18n } = useTranslation();
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeen = sessionStorage.getItem('hasSeenIntro');
    return !hasSeen;
  });
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      key={i18n.language}
    >
      {showIntro ? (
        <IntroScreen onEnter={() => {
          sessionStorage.setItem('hasSeenIntro', 'true');
          setShowIntro(false);
        }} />
      ) : (
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>

              <Route index element={<HomePage />} />

              <Route path="builder" element={<BuilderPage />} />

              <Route path="builder/select/:category" element={<SelectionPage />} />

              <Route path="cart" element={<CartPage />} />

              <Route path="login" element={<AuthPage />} />

              <Route path="about" element={<AboutPage />} />

              <Route path="contact" element={<ContactPage />} />

              <Route path="forum" element={<ComingSoon titleKey="footer.forum" />} />

              <Route path="blog" element={<ComingSoon titleKey="footer.blog" />} />

              <Route path="payment" element={<PaymentPage />} />

              <Route path="order-success" element={<OrderSuccessPage />} />

              <Route path="*" element={<NotFoundPage />} />

            </Route>
          </Routes>
        </ThemeProvider>
      )}
    </GoogleOAuthProvider >
  );
}

export default App;