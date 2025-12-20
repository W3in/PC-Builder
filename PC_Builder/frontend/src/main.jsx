import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import { BuilderProvider } from './context/BuilderContext'; // 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BuilderProvider>
      <App />
    </BuilderProvider>
  </React.StrictMode>,
);