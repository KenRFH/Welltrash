import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                'green-deep': '#0C3325',
                'green-forest': '#103C2B',
                lime: {
                    DEFAULT: '#B7E35C',
                    50: '#f7fee7',
                    100: '#ecfccb',
                    200: '#d9f99d',
                    300: '#bef264',
                    400: '#a3e635',
                    500: '#84cc16',
                    600: '#65a30d',
                    700: '#4d7c0f',
                    800: '#3f6212',
                    900: '#365314',
                },
                paper: '#F4F6EF',
                mint: '#DFE9CE',
                ink: '#10271D',
                muted: '#5F756A',
            },
            fontFamily: {
                sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
                serif: ['"Instrument Serif"', ...defaultTheme.fontFamily.serif],
                mono: ['"DM Mono"', ...defaultTheme.fontFamily.mono],
            },
            maxWidth: {
                '1440': '1440px',
            },
            borderRadius: {
                sm: '2px',
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                marqueeReverse: 'marqueeReverse 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                marqueeReverse: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            },
        },
    },

    plugins: [forms],
};

