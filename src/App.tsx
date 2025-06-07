import { ChangeEvent, useRef, useState } from "react"
import FontSelect from "./FontSelect"
import "./index.css"

const showFontSize = 24
const renderFontSize = 72

export type FontEntry = {
  name: string
  fontFamily: string | File
}

const fontsList: Array<FontEntry> = [
  {
    name: "Noto Serif Traditional Chinese",
    fontFamily: "Noto Serif TC",
  },
]

function App() {
  const [content, setContent] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [color, setColor] = useState("#000000")
  const [customFont, setCustomFont] = useState<string | null>(null)

  const loadUserFont = (fontFile: File) => {
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

    reader.readAsArrayBuffer(fontFile)
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
      const url = canvas.toDataURL("image/png")
      window.open(url, "_blank")
      console.log(url)
    }
  }

  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current
    if (canvas) {
      try {
        const toBlob = () =>
          new Promise<Blob | null>((resolve, reject) => {
            try {
              canvas.toBlob((b) => {
                resolve(b)
              }, "image/png")
            } catch (error) {
              reject(error)
            }
          })
        const blob = await toBlob()

        if (!blob) throw new Error("No blob")
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ])
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-mono text-foreground">
      <div className="max-w-xl w-full p-8 space-y-6 bg-sec rounded-lg shadow-md">
        <header className="text-center mb-8">
          <h1 className="text-pri text-3xl font-bold mb-2">Font Story</h1>
          <h3 className="text-accent1 text-lg">
            Create Story with decent fonts!
          </h3>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-4 bg-white rounded-md border border-accent1">
              <label
                htmlFor="uploadFont"
                className="block text-pri text-sm font-semibold mb-2"
              >
                Upload Font
              </label>
              <input
                id="uploadFont"
                onChange={(e) => {
                  if (!e.target.files) {
                    return
                  }
                  const file = e.target.files[0]

                  loadUserFont(file)
                }}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                className="block w-full text-sm text-foreground
							file:mr-4 file:py-2 file:px-4
							file:rounded-full file:border-0
							file:text-sm file:font-semibold
							file:bg-accent1 file:text-white
							hover:file:bg-pri"
              />
            </div>

            <div className="p-4 bg-white rounded-md border border-accent1">
              <label
                htmlFor="colorInput"
                className="block text-pri text-sm font-semibold mb-2"
              >
                Text color:
              </label>
              <input
                id="colorInput"
                type="color"
                value={color}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setColor(e.target.value)
                }
                className="w-full h-10 rounded-md border border-accent1 cursor-pointer"
              />
            </div>
          </div>
          <div className="p-4 bg-white rounded-md border border-accent1">
            <label
              htmlFor="selectFont"
              className="block text-pri text-sm font-semibold mb-2"
            >
              Select Font
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              {fontsList.map((font, idx) => (
                <FontSelect
                  fontLoader={(fF) => {
                    if (typeof fF === "string") {
                      setCustomFont(fF)
                      return
                    }
                    loadUserFont(fF)
                  }}
                  font={font}
                  key={idx}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-md border border-accent1">
            <label
              htmlFor="textInput"
              className="block text-pri text-sm font-semibold mb-2"
            >
              Enter Text
            </label>
            <textarea
              id="textInput"
              style={{
                fontFamily: customFont ?? "Space Mono", // Use Space Mono as default if no custom font
                color,
              }}
              onChange={(e) => {
                setContent(e.target.value)
              }}
              value={content}
              placeholder="Type your text here..."
              className="min-h-[150px] w-full p-3 rounded-md border border-accent1 bg-white text-foreground placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pri text-base"
            />
          </div>
        </div>

        <canvas ref={canvasRef} id="canvas" className="hidden" />
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="w-full flex-1 py-3 px-6 bg-pri text-white font-bold rounded-md shadow-sm hover:bg-accent1 transition-colors duration-200"
          >
            Export Image
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="w-full flex-1 py-3 px-6 bg-pri text-white font-bold rounded-md shadow-sm hover:bg-accent1 transition-colors duration-200"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
