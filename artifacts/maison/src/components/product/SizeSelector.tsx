"use client"
import { useState } from "react"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export function SizeSelector({ 
  variants 
}: { 
  variants: any[] 
}) {
  const [selected, setSelected] = useState<string | null>(null)

  const availableSizes = variants?.length > 0
    ? variants.map(v => v.size).filter(Boolean)
    : sizes

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs tracking-widest 
                         uppercase text-muted">
          Size
        </span>
        <button className="font-mono text-xs tracking-widest 
                           uppercase text-gold underline">
          Size Guide
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`
              w-12 h-12 border font-mono text-xs 
              tracking-widest transition-all
              ${selected === size 
                ? "border-ink bg-ink text-white" 
                : "border-site-border text-ink hover:border-ink"
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 font-mono text-xs text-muted">
          Size {selected} selected
        </p>
      )}
    </div>
  )
}
