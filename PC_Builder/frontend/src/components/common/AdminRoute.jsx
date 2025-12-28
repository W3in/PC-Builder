import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (user && user.isAdmin) ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;