import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {logout, reset as resetAuthStatus} from '../../src/features/auth/authSlice.js'; // Importar logout y reset

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Obtener el nombre del usuario para personalizar el saludo
    const {user} = useSelector((state) => state.auth);
    console.log('[DashboardPage] User from useSelector:', user);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetAuthStatus());
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to your Dashboard
                    {user && user.name ? `, ${user.name}!` : '!'} {/* Saludo personalizado */}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This is your protected dashboard area. More features coming soon!
                </Typography>
            </Box>
        </Container>
    );
};

export default DashboardPage;