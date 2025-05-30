import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    snackbar: {
        open: false,
        message: '',
        severity: 'info',
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showSnackbar: (state, action) => {
            state.snackbar.open = true;
            state.snackbar.message = action.payload.message;
            state.snackbar.severity = action.payload.severity || 'info';
        },
        hideSnackbar: (state) => {
            state.snackbar.open = false;
        },
    },
});

export const { showSnackbar, hideSnackbar } = uiSlice.actions;

export const selectSnackbar = (state) => state.ui.snackbar;

export default uiSlice.reducer;