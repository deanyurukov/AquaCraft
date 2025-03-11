import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <React.Suspense fallback="Loading...">
        <StrictMode>
            <App />
        </StrictMode>
    </React.Suspense>
);