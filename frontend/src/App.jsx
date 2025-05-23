import {Routes, Route, Navigate, Link as RouterLink} from 'react-router-dom';
import Box from '@mui/material/Box';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';

function App() {
    return (
        <>
            <Navbar/>
            <Box component="main" sx={{
                p: 2,
                mt: 4,
                maxWidth: 'xl',
                margin: 'auto'
            }}>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route element={<ProtectedRoute/>}>
                        <Route path="/dashboard" element={<DashboardPage/>}/>
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace/>}/>

                    <Route path="*" element={<div><h1>404 - Page Not Found</h1><RouterLink to="/login">Go to Login</RouterLink></div>}/>
                </Routes>
            </Box>
        </>
    );
}

export default App;