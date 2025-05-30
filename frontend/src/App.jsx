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
import {selectSnackbar, hideSnackbar} from './features/ui/uiSlice';

function App() {
    const dispatch = useDispatch();

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
                        <Route path="/projects/:projectId" element={<ProjectDetailPage/>}/>
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace/>}/>

                    <Route path="*"
                           element={<div><h1>404 - Page Not Found</h1><RouterLink to="/login">Go to Login</RouterLink>
                           </div>}/>
                </Routes>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                {message && (
                    <Alert onClose={handleCloseSnackbar} severity={severity || 'info'} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                )}
            </Snackbar>
        </>
    );
}

export default App;