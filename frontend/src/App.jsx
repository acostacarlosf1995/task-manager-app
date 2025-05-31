import {Routes, Route, Navigate, Link as RouterLink} from 'react-router-dom';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useDispatch, useSelector} from 'react-redux';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import HomePage from './pages/HomePage';

import {selectSnackbar, hideSnackbar} from './features/ui/uiSlice';
import {Button, Typography} from "@mui/material";

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const {open, message, severity} = useSelector(selectSnackbar);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(hideSnackbar());
    };

    return (
        <>
            <Navbar/>
            <Box component="main" sx={{
                p: 0,
                mt: 0,
                maxWidth: '100%',
                margin: 'auto',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                    </Route>

                    <Route path="*" element={
                        <Box sx={{
                            minHeight: 'calc(100vh - 64px)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 4
                        }}>
                            <Typography variant="h4" gutterBottom>404 - Page Not Found</Typography>
                            <Button component={RouterLink} to={isAuthenticated ? "/dashboard" : "/login"} variant="contained">
                                Go to {isAuthenticated ? "Dashboard" : "Login"}
                            </Button>
                        </Box>
                    } />
                </Routes>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {message && (
                    <Alert onClose={handleCloseSnackbar} severity={severity || 'info'} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                )}
            </Snackbar>
        </>
    );
}

export default App;