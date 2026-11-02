const THEME_STORAGE_KEY = 'vingt-theme';

export const getInitialTheme = () => {
    let savedTheme;

    try {
        savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
        // Browser privacy settings can prevent access to stored preferences.
    }

    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#111814' : '#f8f8f3');
};

export const saveTheme = theme => {
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        return { success: false, error: 'storage-unavailable' };
    }

    return { success: true };
};
