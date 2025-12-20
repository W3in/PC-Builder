import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          <Route index element={<HomePage />} />

          <Route path="builder" element={<BuilderPage />} />

          <Route path="cart" element={<CartPage />} />

          <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;