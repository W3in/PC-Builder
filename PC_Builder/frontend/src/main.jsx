import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n';
import { BuilderProvider } from './context/BuilderContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BuilderProvider>
          <App />
        </BuilderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)