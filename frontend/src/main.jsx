import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import {BrowserRouter} from 'react-router-dom';

import {Provider} from "react-redux";
import {store} from './app/store';
import {AppThemeProvider} from "./contexts/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <AppThemeProvider>
                    <App />
                </AppThemeProvider>
            </BrowserRouter>
        </Provider>
    // </React.StrictMode>
);
