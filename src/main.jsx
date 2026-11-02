import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.jsx';
import { applyTheme, getInitialTheme } from './theme.js';

import './style.css';

applyTheme(getInitialTheme());

createRoot(document.getElementById('root')).render(<App />);
