/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Clinical semantic colors
                critical: {
                    DEFAULT: '#EF4444',
                    light: '#FEE2E2',
                    dark: '#991B1B'
                },
                high: {
                    DEFAULT: '#F59E0B',
                    light: '#FEF3C7',
                    dark: '#92400E'
                },
                normal: {
                    DEFAULT: '#60A5FA',
                    light: '#DBEAFE',
                    dark: '#1E40AF'
                },
                success: {
                    DEFAULT: '#22C55E',
                    light: '#DCFCE7',
                    dark: '#166534'
                },
                // Background tiers
                slate: {
                    750: '#293548', // Between 700 and 800
                    850: '#172033', // Between 800 and 900
                    950: '#0a1019'  // Darker than 900
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace']
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            },
            gridTemplateColumns: {
                '15': 'repeat(15, minmax(0, 1fr))',
                '20': 'repeat(20, minmax(0, 1fr))',
            }
        },
    },
    plugins: [],
}
