
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Errore critico: Impossibile trovare l'elemento root nell'HTML.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App SaaSMod inizializzata correttamente.");
  } catch (error) {
    console.error("Errore durante il rendering di React:", error);
    rootElement.innerHTML = `<div style="padding: 20px; text-align: center;">
      <h2>Ops! Qualcosa è andato storto nel caricamento.</h2>
      <p>Verifica la console del browser per maggiori dettagli.</p>
    </div>`;
  }
}
