import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from "./authService.js";

const userTokenFromStorage = JSON.parse(localStorage.getItem('userToken'));

const initialState = {
    user: null,
    token: userTokenFromStorage ? userTokenFromStorage : null,
    isAuthenticated: userTokenFromStorage ? true : false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) || // Error en la API backend
                (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0] && error.response.data.errors[0].msg) || // Error de express-validator
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            return await authService.login(userData);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) || // Error en la API backend
                (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0] && error.response.data.errors[0].msg) || // Error de express-validator
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await authService.logout();
    }
);

// Creamoss el slice

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isAuthenticated = true;
                state.user = { _id: action.payload._id, name: action.payload.name, email: action.payload.email };
                state.token = action.payload.token;
                state.message = action.payload.message || '¡User registered successfully!';
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isAuthenticated = true;
                state.user = { _id: action.payload._id, name: action.payload.name, email: action.payload.email };
                state.token = action.payload.token;
                state.message = action.payload.message || '¡Login successfully, welcome back!';
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.message = '¡Logout successfully!';
            });
    }
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;