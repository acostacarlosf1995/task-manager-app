import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout, reset as resetAuthStatus } from '../../features/auth/authSlice';
import { resetProjectStatus } from '../../features/projects/projectSlice';
import { clearTasks } from '../../features/tasks/taskSlice';
import { useThemeMode } from '../../contexts/ThemeContext.jsx'; // Correcto

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

const Logo = (props) => {
    const theme = useTheme();
    const currentTextColor = props.textColor || (theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.common.white);

    return (
        <SvgIcon
            {...props}
            viewBox="0 0 300 80"
            sx={{
                display: 'block',
                height: props.height || '50px',
                width: props.width || 'auto',
                ...props.sx
            }}
            titleAccess="CTaskManager Logo"
        >
            <text x="10" y="55" fontFamily="Arial, Helvetica, sans-serif" fontSize="40" fill="white" fontWeight="bold">
                C
            </text>
            <text x="40" y="55" fontFamily="Arial, Helvetica, sans-serif" fontSize="40" fill={currentTextColor}>
                TaskManager
            </text>
        </SvgIcon>
    );
};


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { mode, toggleColorMode } = useThemeMode();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openUserMenu = Boolean(anchorEl);

    const handleUserMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleUserMenuClose();
        dispatch(logout());
        dispatch(resetAuthStatus());
        dispatch(resetProjectStatus());
        dispatch(clearTasks());
        navigate('/login');
    };

    const authLinks = (
        <>
            <Tooltip title={mode === 'light' ? "Switch to dark mode" : "Switch to light mode"}>
                <IconButton sx={{ mr: 1 }} onClick={toggleColorMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Tooltip>

            <Typography variant="subtitle1" component="div" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                {user ? `Hi, ${user.name}` : ''}
            </Typography>
            <Button color="inherit" onClick={handleLogout} sx={{ mr: 1 }}>
                Logout
            </Button>
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
            >
                <AccountCircle />
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
                sx={{ mt: '45px' }}
            >
                <MenuItem component={RouterLink} to="/dashboard" onClick={handleUserMenuClose}>Dashboard</MenuItem>
            </Menu>
        </>
    );

    const guestLinks = (
        <>
            <Tooltip title={mode === 'light' ? "Switch to dark mode" : "Switch to light mode"}>
                <IconButton sx={{ mr: 1 }} onClick={toggleColorMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Tooltip>
            <Button color="inherit" component={RouterLink} to="/login">
                Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
                Register
            </Button>
        </>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <RouterLink to={isAuthenticated ? "/dashboard" : "/login"} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Logo
                            sx={{
                                height: '50px',
                                width: 'auto',
                                mr: 1
                            }}
                        />
                    </RouterLink>
                    <Box sx={{ flexGrow: 1 }} />
                    {isAuthenticated ? authLinks : guestLinks}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;