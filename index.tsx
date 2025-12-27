import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Target container 'root' not found in the DOM.");
}

const root = createRoot(container);

const RootApp = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

try {
  root.render(<RootApp />);
} catch (error) {
  console.error("Rendering error:", error);
  container.innerHTML = `<div style="color: white; padding: 20px;">Failed to start: ${error instanceof Error ? error.message : String(error)}</div>`;
}