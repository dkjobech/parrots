// Apple-inspired styling constants
const appleStyles = {
    colors: {
        background: '#ffffff',
        primary: '#007aff',
        secondary: '#f2f2f7',
        success: '#34c759',
        text: '#1d1d1f',
        lightText: '#86868b',
        border: '#e5e5ea'
    },
    fonts: {
        primary: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    borderRadius: '12px',
    transition: 'all 0.2s ease-in-out',
    shadows: {
        small: '0 1px 2px rgba(0, 0, 0, 0.05)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    animations: {
        fadeIn: `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `
    }
};

export default appleStyles;