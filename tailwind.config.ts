
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: '#e5e7eb',
				input: '#e5e7eb',
				ring: '#2563eb',
				background: '#f8fafc',
				foreground: '#1f2937',
				primary: {
					DEFAULT: '#2563eb',
					foreground: '#ffffff',
					50: '#eff6ff',
					100: '#dbeafe',
					500: '#2563eb',
					600: '#1d4ed8',
					700: '#1e40af',
					hover: '#1d4ed8',
				},
				secondary: {
					DEFAULT: '#10b981',
					foreground: '#ffffff',
					50: '#ecfdf5',
					100: '#d1fae5',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					hover: '#059669',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#f3f4f6',
					foreground: '#6b7280'
				},
				accent: {
					DEFAULT: '#f3f4f6',
					foreground: '#1f2937'
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#1f2937'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#1f2937'
				},
				sidebar: {
					DEFAULT: '#ffffff',
					foreground: '#1f2937',
					primary: '#2563eb',
					'primary-foreground': '#ffffff',
					accent: '#f3f4f6',
					'accent-foreground': '#1f2937',
					border: '#e5e7eb',
					ring: '#2563eb',
					background: '#ffffff',
				},
				success: '#22c55e',
				error: '#ef4444',
				warning: '#facc15',
				'text-primary': '#1f2937',
				'text-secondary': '#6b7280',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
