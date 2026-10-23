import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { trackVisit, trackLeave } from './lib/tracker';
import { registerPush } from './lib/push';
import App from './App';

// Sikiliza trigger ya install
window.addEventListener('trigger-install', () => {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
  } else {
    window.dispatchEvent(new Event('pwa-install-manual'));
  }
});
import './styles/global.css';

// Weka dark mode kama default
document.documentElement.setAttribute('data-theme', 'dark');

function Root() {
  useEffect(() => {
    // Rekodi kuingia
    trackVisit();
    registerPush();

    // Rekodi kutoka mtumiaji anapofunga ukurasa
    const handleLeave = () => trackLeave();
    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') trackLeave();
    });

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
