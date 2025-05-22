import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

const ProtectedRoute = () => {
    const {isAuthenticated, isLoading} = useSelector((state) => state.auth);
    const location = useLocation();

    // console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

    if (isLoading) {
        return <div>Loading authentication status...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <Outlet/>;
};

export default ProtectedRoute;