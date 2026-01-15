import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './routes/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';


import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';


import AdminRoute from './components/common/AdminRoute';
import IntroScreen from './components/common/IntroScreen';


import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import PreBuiltPage from './pages/PreBuiltPage';
import SelectionPage from './pages/SelectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoon from './pages/ComingSoon';
import ShippingPage from './pages/ShippingPage';


import DashboardPage from './pages/admin/DashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import CouponListPage from './pages/admin/CouponListPage';
import CouponEditPage from './pages/admin/CouponEditPage';


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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route index element={<HomePage />} />

              <Route path="builder" element={<BuilderPage />} />
              <Route path="builder/select/:category" element={<SelectionPage />} />
              <Route path="prebuilt" element={<PreBuiltPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />

              <Route path="profile" element={<ProfilePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />

              <Route path="forum" element={<ComingSoon titleKey="footer.forum" />} />
              <Route path="blog" element={<ComingSoon titleKey="footer.blog" />} />
            </Route>

            <Route path="/login" element={<AuthPage />} />
            <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/order-success" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="product/:id/edit" element={<ProductEditPage />} />
                <Route path="product/create" element={<ProductEditPage />} />
                <Route path="orders" element={<OrderListPage />} />
                <Route path="order/:id" element={<OrderDetailPage />} />
                <Route path="coupons" element={<CouponListPage />} />
                <Route path="coupon/create" element={<CouponEditPage />} />
                <Route path="coupon/:id/edit" element={<CouponEditPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </ThemeProvider>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;