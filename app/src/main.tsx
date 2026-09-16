import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@hs2190.an/iris-tokens/css';
import '@hs2190.an/iris-react/styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
