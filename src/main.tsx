import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress automatic browser install prompts; this site intentionally has no install popup/PWA prompt.
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
});
createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
