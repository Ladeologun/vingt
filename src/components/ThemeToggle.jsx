import React, { useState } from 'react';

import { applyTheme, saveTheme } from '../theme.js';

import { Icon } from './Icon.jsx';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState(document.documentElement.dataset.theme);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        applyTheme(nextTheme);
        setTheme(nextTheme);
        saveTheme(nextTheme);
    };

    const isDarkMode = theme === 'dark';
    const label = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            className="theme-toggle"
            type="button"
            aria-label={label}
            aria-pressed={isDarkMode}
            title={label}
            onClick={toggleTheme}
        >
            <Icon name={isDarkMode ? 'sun' : 'moon'} size={17} />
            <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
        </button>
    );
};
