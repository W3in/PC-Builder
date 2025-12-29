import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    return user ? children : <Link to="/auth" state={{ from: location.pathname }} />;
};

export default PrivateRoute;