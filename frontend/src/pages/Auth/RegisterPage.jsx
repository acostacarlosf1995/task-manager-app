import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import {register, reset as resetAuthStatus} from '../../features/auth/authSlice';

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

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');

    const {name, email, password, confirmPassword} = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isAuthenticated, isLoading, isError, isSuccess, message, validationErrors} = useSelector(
        (state) => state.auth
    );

    const getFieldError = (fieldName) => {
        if (validationErrors && validationErrors.length > 0) {
            const error = validationErrors.find(err => err.path === fieldName);
            return error ? error.msg : null;
        }
        return null;
    };

    // Mensajes de error específicos para cada campo
    const nameErrorMessage = getFieldError('name');
    const emailErrorMessage = getFieldError('email');
    const passwordErrorMessage = getFieldError('password');

    useEffect(() => {
        console.log(`[LoginPage useEffect] isAuth: ${isAuthenticated}, isSuccess: ${isSuccess}`);
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
        setFormError('');
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(resetAuthStatus());
        setFormError('');
        // dispatch(resetAuthStatus());

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        const userData = {name, email, password};
        dispatch(register(userData));
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
                    Sign Up
                </Typography>
                {formError && (
                    <Alert severity="error" sx={{width: '100%', mt: 2}}>
                        {formError}
                    </Alert>
                )}

                {isError && message && !validationErrors?.length && (typeof message === 'string') && (
                    <Alert severity="error" sx={{width: '100%', mt: 2}} onClose={() => dispatch(resetAuthStatus())}>
                        {message}
                    </Alert>
                )}

                <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
                    {/*<Grid container spacing={2}>*/}
                    {/*    <Grid item xs={12}>*/}
                            <TextField
                                margin="normal"
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={onChange}
                                error={!!nameErrorMessage}
                                helperText={nameErrorMessage}
                            />
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={onChange}
                                error={!!emailErrorMessage}
                                helperText={emailErrorMessage}
                            />
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={onChange}
                                error={!!passwordErrorMessage}
                                helperText={passwordErrorMessage}
                            />
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={onChange}
                                error={!!formError}
                            />
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;