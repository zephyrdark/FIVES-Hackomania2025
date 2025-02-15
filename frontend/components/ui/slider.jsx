"use client"

import React, { useState } from "react"

const Slider = React.forwardRef(({ className, min, max, step, value, onValueChange, ...props }, ref) => {
  const [localValue, setLocalValue] = useState(value[0])

  const handleChange = (e) => {
    const newValue = Number(e.target.value)
    setLocalValue(newValue)
    onValueChange([newValue])
  }

  return (
    <div className={`relative w-full ${className}`} ref={ref} {...props}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div
        className="absolute h-2 bg-primary rounded-lg"
        style={{
          width: `${((localValue - min) / (max - min)) * 100}%`,
        }}
      />
    </div>
  )
})

Slider.displayName = "Slider"

export { Slider }



