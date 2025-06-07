/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				pri: "#333333",
				sec: "#F0F0F0",
				accent1: "#666666",
				background: "#FFFFFF",
				foreground: "#333333",
			},
			fontFamily: {
				mono: ['"Space Mono"', 'monospace'], // Added Space Mono as an example, with monospace fallback
			},
		},
	},
	plugins: [],
}
