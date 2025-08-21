import React from 'react';
import ReactDOM from 'react-dom/client';
import { StorageHelper } from './common/helpers/storage-helper';
import App from './app';
import '@cloudscape-design/global-styles/index.css';

/**
 * Application entry point
 * Initializes the React application with theme management and strict mode
 */

// Get the root DOM element and create React root
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Initialize and apply the user's preferred theme
const userTheme = StorageHelper.getTheme();
StorageHelper.applyTheme(userTheme);

// Render the application with React StrictMode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
