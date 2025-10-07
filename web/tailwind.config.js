/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales basées sur la V1
        primary: {
          DEFAULT: '#10B981', // vert émeraude 500 (couleur principale de la V1)
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669', // utilisé pour les boutons actifs
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Couleurs secondaires
        secondary: {
          DEFAULT: '#2563EB', // bleu 600 (couleur secondaire de la V1)
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Couleurs d'arrière-plan
        background: {
          light: '#F9FAFB', // gray-50 (fond clair de la V1)
          dark: '#111827', // gray-900
        },
        // Couleurs de texte
        foreground: {
          light: '#1F2937', // gray-800 (texte principal)
          dark: '#F9FAFB', // gray-50
        },
        // Couleurs de bordure
        border: {
          light: '#E5E7EB', // gray-200
          dark: '#374151', // gray-700
        },
        // Couleurs d'accent
        accent: {
          light: '#F3F4F6', // gray-100
          dark: '#1E293B', // slate-800
        },
        // Couleurs d'état
        success: {
          DEFAULT: '#10B981', // emerald-500
          light: '#D1FAE5', // emerald-100
          dark: '#065F46', // emerald-800
        },
        warning: {
          DEFAULT: '#F59E0B', // amber-500
          light: '#FEF3C7', // amber-100
          dark: '#92400E', // amber-800
        },
        error: {
          DEFAULT: '#EF4444', // red-500
          light: '#FEE2E2', // red-100
          dark: '#991B1B', // red-800
        },
        info: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#DBEAFE', // blue-100
          dark: '#1E40AF', // blue-800
        },
        danger: {
          DEFAULT: '#EF4444', // red-500
          light: '#FEE2E2', // red-100
          dark: '#B91C1C', // red-700
        },
      },
      fontFamily: {
        sans: ['Instrument Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
