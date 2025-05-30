import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import {login, reset as resetAuthStatus} from '../../features/auth/authSlice';
import {store} from '../../app/store.js';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const isSuccess = useSelector((state) => state.auth.isSuccess);
    const isError = useSelector((state) => state.auth.isError);
    const message = useSelector((state) => state.auth.message);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }

        return () => {
            if (isSuccess || isError) {
                dispatch(resetAuthStatus());
            }
        };
    }, [isAuthenticated, isSuccess, isError, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(resetAuthStatus());
        const userData = {email, password};
        dispatch(login(userData));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>

                <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Sign In'}
                    </Button>
                    <Grid container>
                        <Grid>
                        </Grid>
                        <Grid>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;