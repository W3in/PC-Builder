import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ChatWidget from '../components/common/ChatWidget';
const MainLayout = () => {
    return (
        <div>
            <Header />

            <main style={{ padding: '20px', minHeight: '80vh' }}>
                <Outlet />
            </main>

            <Footer />
            <ChatWidget />
        </div>
    );
};

export default MainLayout;