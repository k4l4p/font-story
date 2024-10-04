import { ChangeEvent, useRef, useState } from "react"
import "./index.css"

const showFontSize = 24
const renderFontSize = 72

function App() {
	const [content, setContent] = useState("")
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const [color, setColor] = useState("#000000")
	const [customFont, setCustomFont] = useState<string | null>(null)

	const loadFont = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			return
		}
		const file = e.target.files[0]
		const reader = new FileReader()

		// read font callback
		reader.onload = async (e) => {
			if (!e.target?.result) {
				return
			}
			const fontFace = new FontFace("newFont", e.target.result)
			const loadedFontFace = await fontFace.load()
			document.fonts.add(loadedFontFace)
			setCustomFont("newFont")
		}

		reader.readAsArrayBuffer(file)
	}

	const updateCanvas = () => {
		const ratio = window.devicePixelRatio
		const canvas = canvasRef.current
		if (canvas) {
			const ctx = canvas.getContext("2d")
			if (ctx) {
				const lines = content.split("\n")
				let y = 0
				const lineHeight = renderFontSize * 1.2
				let maxWidth = 0
				let totalHeight = 0

				lines.forEach((line) => {
					const metrics = ctx.measureText(line)
					maxWidth = Math.max(maxWidth, metrics.width)
					totalHeight += lineHeight
				})

				canvas.width = maxWidth * ratio
				canvas.height = totalHeight * ratio

				ctx.scale(ratio, ratio)
				ctx.clearRect(0, 0, canvas.width, canvas.height)
				ctx.font = `${renderFontSize}px ${customFont || "Arial"}`
				ctx.fillStyle = color
				ctx.textBaseline = "top"

				lines.forEach((line) => {
					ctx.fillText(line, 0, y)
					y += lineHeight
				})
			}
		}
	}

	const handleDownload = (): void => {
		updateCanvas()
		const canvas = canvasRef.current
		if (canvas) {
			const link = document.createElement("a")
			link.download = "custom_text.png"
			link.href = canvas.toDataURL("image/png")
			link.click()
		}
	}

	return (
		<div className="bg-pri">
			<div className="max-w-96 mx-auto">
				<div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-background text-foreground">
					<header>
						<h1 className="text-accent1">Font Story</h1>
						<h3 className="text-accent1">Create Story with decent fonts!</h3>
					</header>

					<div className="bg-sec w-full rounded-2xl shadow-lg px-4 py-8">
						<div className="grid gap-2">
							<label htmlFor="image">Upload Font</label>
							<input
								onChange={loadFont}
								type="file"
								accept=".ttf,.otf,.woff,.woff2"
							/>
						</div>

						<div className="grid gap-2">
							<label htmlFor="colorInput">Text color: </label>
							<input
								id="colorInput"
								type="color"
								value={color}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setColor(e.target.value)
								}
								style={{ marginBottom: "10px" }}
							/>
						</div>
					</div>

					<div className="w-full max-w-md px-4 py-8 space-y-4 rounded-2xl bg-sec shadow-lg">
						<div className="grid gap-2">
							<label htmlFor="text">Enter Text</label>
							<textarea
								style={{
									fontFamily: customFont ?? "Ariel",
									color,
									fontSize: showFontSize,
								}}
								onChange={(e) => {
									setContent(e.target.value)
								}}
								value={content}
								placeholder="Type your text here..."
								className="min-h-[100px] rounded-xl p-1"
							/>
						</div>

						<canvas ref={canvasRef} id="canvas" className="hidden" />
						<button onClick={handleDownload} className="w-full">
							Export Image
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
