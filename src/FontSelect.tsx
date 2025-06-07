import { FontEntry } from "./App"

type FontSelectProps = {
  font: FontEntry
  fontLoader: (fontFamily: FontEntry["fontFamily"]) => void
}

const FontSelect = ({
  font,
  fontLoader,
}: {
  font: FontEntry
  fontLoader: (fontFamily: FontEntry["fontFamily"]) => void
}) => {
  return (
    <button
      onClick={() => {
        fontLoader(font.fontFamily)
      }}
      className="truncate max-w-7 hover:max-w-20 transition-[max-width] p-2 border-pri border rounded-md shadow-sm overflow-hidden"
    >
      <span>{font.name}</span>
    </button>
  )
}

export default FontSelect
