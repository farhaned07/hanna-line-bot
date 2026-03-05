/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ========================================
                // LIGHT MODE - TEAL + OFF-WHITE PALETTE
                // ========================================

                // Brand Identity
                'hana': {
                    'primary': '#6d9dad',   // Muted Teal/Cyan - Main accent
                    'accent': '#0d465f',    // Deep Teal - Gradient anchor
                    'dark': '#082f40',      // Darkest brand color
                    'light': '#eef6f8',     // Very light tint
                },

                // Surfaces (Light Mode)
                'surface': {
                    'DEFAULT': '#F8FAFC',   // Off-White (Slate-50) - Main page bg
                    'subtle': '#FFFFFF',    // Pure White - Cards, containers
                    'raised': '#F1F5F9',    // Slate-100 - Hover states
                    'dark': '#0F172A',      // Navy - For dark sections if needed
                },

                // Borders (Light, visible)
                'border': {
                    'DEFAULT': '#E2E8F0',   // Slate-200
                    'subtle': '#F1F5F9',    // Slate-100
                    'strong': '#CBD5E1',    // Slate-300
                    'focus': '#6d9dad',     // Accent for focus rings
                },

                // Text (Dark on light)
                'text': {
                    'primary': '#0F172A',   // Navy
                    'secondary': '#334155', // Slate-Body
                    'tertiary': '#64748B',  // Slate-500
                },

                // Legacy / Direct Access
                'hana-primary': '#6d9dad',
                'hana-accent': '#0d465f',   // Deep Teal for headings/accents
                'slate-body': '#334155',
                'cool-gray': '#F8FAFC',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],      // Headlines
                body: ['Inter', 'sans-serif'],         // Body text
                mono: ['JetBrains Mono', 'monospace'], // Technical details
            },
            letterSpacing: {
                'tightest': '-0.04em',
                'tighter': '-0.02em',
                'normal': '0em',
                'wide': '0.025em',
                'widest': '0.1em',
            },
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            },
            borderRadius: {
                'sm': '4px',
                DEFAULT: '8px',
                'md': '10px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '24px',
                '3xl': '32px',
            },
            boxShadow: {
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                // Colored Shadows (The "Unicorn" Polish)
                'brand': '0 20px 40px -10px rgba(109, 157, 173, 0.3)', // hana-primary shadow
                'brand-sm': '0 10px 20px -5px rgba(109, 157, 173, 0.2)',
                'glow': '0 0 20px rgba(109, 157, 173, 0.5)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'shimmer': 'shimmer 2.5s infinite linear',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
