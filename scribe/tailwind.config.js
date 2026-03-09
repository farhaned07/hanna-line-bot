import colors from 'tailwindcss/colors';

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
                // Alias slate to zinc for consistent dark theme
                slate: {
                    ...colors.zinc,
                    750: '#293548',
                    850: '#172033',
                    950: '#0a1019'
                },
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
                // Scribe-specific colors
                primary: {
                    DEFAULT: '#6366F1',
                    light: '#818CF8',
                    dark: '#4F46E5',
                    hover: '#4338CA'
                },
                background: {
                    DEFAULT: '#0B0D12',
                    secondary: '#13151A',
                    tertiary: '#1E2129'
                },
                card: {
                    DEFAULT: '#13151A',
                    hover: 'rgba(255, 255, 255, 0.05)'
                },
                border: {
                    DEFAULT: 'rgba(255, 255, 255, 0.08)',
                    light: 'rgba(255, 255, 255, 0.12)'
                },
                muted: {
                    DEFAULT: '#64748B',
                    foreground: '#94A3B8'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace']
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'orb-pulse': 'orbPulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                orbPulse: {
                    '0%, 100%': { scale: '1', opacity: '1' },
                    '50%': { scale: '1.05', opacity: '0.9' }
                }
            },
            boxShadow: {
                'primary-glow': '0 0 20px rgba(99, 102, 241, 0.3)',
                'primary-glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
            }
        },
    },
    plugins: [],
}
