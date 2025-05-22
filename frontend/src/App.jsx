import {Routes, Route, Navigate, Link} from 'react-router-dom';
import Box from '@mui/material/Box'; // O Container de MUI

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
    return (
        <>
            <Box component="main" sx={{p: 2, mt: 4, maxWidth: 'xl', margin: 'auto'}}>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>

                    {/* Rutas Protegidas */}
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/dashboard" element={<DashboardPage/>}/>
                    </Route>

                    {/* Si el usuario va a la raíz, si está autenticado va a dashboard, si no a login */}
                    <Route
                        path="/"
                        element={
                            <Navigate to="/login" replace/>
                        }
                    />

                    <Route path="*"
                           element={
                               <div><h1>404 - Page Not Found</h1>
                                   <Link to="/login">Go to Login</Link>
                               </div>}/>
                    </Routes>
            </Box>
        </>
    );
}

export default App;