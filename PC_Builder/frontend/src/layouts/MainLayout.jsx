import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const MainLayout = () => {
    return (
        <div>
            <Header />

            <main style={{ padding: '20px', minHeight: '80vh' }}>
                <Outlet />
            </main>

            <footer style={{ background: '#eee', padding: '10px', textAlign: 'center', marginTop: '20px' }}>
                &copy; 2025 PC Builder Project
            </footer>
        </div>
    );
};

export default MainLayout;