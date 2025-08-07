// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "./controllers"
import "./channels"
// import * as bootstrap from "bootstrap"
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('react-root');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
});


