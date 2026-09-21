import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n/i18n';
import { AuthProvider } from './context/AuthContext';
import { HelplineProvider } from './context/HelplineContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HelplineProvider>
          <App />
        </HelplineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
