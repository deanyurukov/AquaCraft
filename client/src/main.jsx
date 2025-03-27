import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import App from './App.jsx';
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
    <React.Suspense fallback="Loading...">
        <StrictMode>
            <App />
            <Analytics />
        </StrictMode>
    </React.Suspense>
);