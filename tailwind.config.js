import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans], // ganti default
                inter: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
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
