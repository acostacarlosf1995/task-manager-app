import { Routes, Route, Navigate } from 'react-router-dom';
// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <>
            {/* <Navbar /> */}
            <Box component="main" sx={{ p: 2, mt:4, maxWidth: 'xl', margin: 'auto' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<div><h1>404 - Page Not Found</h1><a href="/login">Go to Login</a></div>} />
                </Routes>
            </Box>
        </>
    );
}

export default App;
