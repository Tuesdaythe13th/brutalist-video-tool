
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
				mono: ["'Roboto Mono'", 'monospace'],
				sans: ["'Roboto Mono'", 'monospace'],
			},
			colors: {
				border: 'black',
				input: 'black',
				ring: 'black',
				background: 'white',
				foreground: 'black',
				primary: {
					DEFAULT: 'black',
					foreground: 'white'
				},
				secondary: {
					DEFAULT: '#555555',
					foreground: 'white'
				},
				destructive: {
					DEFAULT: 'black',
					foreground: 'white'
				},
				muted: {
					DEFAULT: '#f1f1f1',
					foreground: 'black'
				},
				accent: {
					DEFAULT: '#c0c0c0',
					foreground: 'black'
				},
				popover: {
					DEFAULT: 'white',
					foreground: 'black'
				},
				card: {
					DEFAULT: 'white',
					foreground: 'black'
				},
			},
			borderRadius: {
				lg: '0',
				md: '0',
				sm: '0'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'blink': 'blink 1s step-start infinite',
			},
			boxShadow: {
				'brutalist': '4px 4px 0px 0px #000000',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
