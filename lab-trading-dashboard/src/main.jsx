import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

async function loadApp() {
  const isShadow = import.meta.env.VITE_SHADOW === 'true';
  const { default: App } = await import(isShadow ? './App_shadow.jsx' : './App.jsx');

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

loadApp();