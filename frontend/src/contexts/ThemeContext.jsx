import React, {createContext, useState, useMemo, useContext} from 'react';
import {createTheme, ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext({
    toggleColorMode: () => {
    },
    mode: 'light',
});

export const useThemeMode = () => useContext(ThemeContext);

export const AppThemeProvider = ({children}) => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? { // Paleta para dark mode
                            primary: {main: '#1976d2'},
                            secondary: {main: '#dc004e'},
                            background: {default: '#f4f6f8', paper: '#ffffff'},
                        }
                        : { // Paleta para light mode
                            primary: {main: '#90caf9'},
                            secondary: {main: '#f48fb1'},
                            background: {default: '#121212', paper: '#1e1e1e'},
                            text: {primary: '#ffffff', secondary: '#bbbbbb'}
                        }),
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};