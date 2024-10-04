/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				pri: "#257180",
				sec: "#F2E5BF",
				accent1: "#FD8B51",
				accent2: "#CB6040",
			},
		},
	},
	plugins: [],
}
