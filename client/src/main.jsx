import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1e1e2e',
                        color: '#e2e8f0',
                        border: '1px solid rgba(108,99,255,0.3)',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                    },
                    success: { iconTheme: { primary: '#00b894', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ff7675', secondary: '#fff' } },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>,
)
