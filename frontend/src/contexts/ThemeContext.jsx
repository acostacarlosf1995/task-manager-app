import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext({
    toggleColorMode: () => {},
    mode: 'light',
});

export const useThemeMode = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        try {
            const storedMode = localStorage.getItem('themeMode');
            return storedMode ? storedMode : 'light';
        } catch (e) {
            return 'light';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('themeMode', mode);
        } catch (e) {
            // Silently ignore if localStorage is not available
        }
    }, [mode]);

    const colorModeAPI = useMemo(
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
                        ? {
                            primary: {
                                main: '#2D9CDB',
                            },
                            secondary: {
                                main: '#6c757d',
                            },
                            background: {
                                default: '#f8f9fa',
                                paper: '#ffffff',
                            },
                            text: {
                                primary: 'rgba(0, 0, 0, 0.87)',
                                secondary: 'rgba(0, 0, 0, 0.6)',
                            },
                            divider: 'rgba(0, 0, 0, 0.12)',
                        }
                        : {
                            primary: {
                                main: '#58a6ff',
                            },
                            secondary: {
                                main: '#8b949e',
                            },
                            background: {
                                default: '#0d1117',
                                paper: '#161b22',
                            },
                            text: {
                                primary: '#c9d1d9',
                                secondary: '#8b949e',
                            },
                            divider: 'rgba(255, 255, 255, 0.12)',
                        }),
                },
                shape: {
                    borderRadius: 8,
                },
                components: {
                    // MuiAppBar: {
                    //     styleOverrides: {
                    //         root: ({ theme: currentTheme }) => ({
                    //         }),
                    //     }
                    // },
                    MuiFab: {
                        styleOverrides: {
                            secondary: ({theme: currentTheme}) => ({
                                backgroundColor: currentTheme.palette.mode === 'dark' ? currentTheme.palette.secondary.light : currentTheme.palette.secondary.main,
                                color: currentTheme.palette.getContrastText(currentTheme.palette.mode === 'dark' ? currentTheme.palette.secondary.light : currentTheme.palette.secondary.main),
                                '&:hover': {
                                    backgroundColor: currentTheme.palette.mode === 'dark' ? currentTheme.palette.secondary.main : currentTheme.palette.secondary.dark,
                                }
                            })
                        }
                    }
                }
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={colorModeAPI}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};