import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {logout, reset as resetAuthStatus} from '../../features/auth/authSlice';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isAuthenticated} = useSelector((state) => state.auth);

    // Mmenú desplegable del usuario
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openUserMenu = Boolean(anchorEl);

    const handleUserMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleUserMenuClose(); // Cerrar menú si está abierto
        dispatch(logout());
        dispatch(resetAuthStatus());
        navigate('/login'); // Redirigir a login después del logout
    };

    const authLinks = (
        <>
            <Typography variant="subtitle1" component="div" sx={{mr: 2}}>
                {user ? `Hi, ${user.name}` : ''}
            </Typography>
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
            >
                <AccountCircle/>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={openUserMenu}
                onClose={handleUserMenuClose}
            >
                <MenuItem component={RouterLink} to="/dashboard" onClick={handleUserMenuClose}>Dashboard</MenuItem>
                {/* <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem> */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );

    const guestLinks = (
        <>
            <Button color="inherit" component={RouterLink} to="/login">
                Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
                Register
            </Button>
        </>
    );

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/"
                                sx={{flexGrow: 1, color: 'inherit', textDecoration: 'none'}}>
                        Task Manager Pro
                    </Typography>
                    {isAuthenticated ? authLinks : guestLinks}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;