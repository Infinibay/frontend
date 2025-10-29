"use client"

import React, { useState, useRef } from "react"
import { X, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * TagInput Component
 * Allows users to add/remove tags with a clean pill-based UI
 * Following Infinibay design guidelines with glass effects
 */
export function TagInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  className,
  disabled = false
}) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef(null)

  const handleAddTag = (tagToAdd) => {
    const trimmedTag = tagToAdd.trim().toLowerCase()

    // Validation
    if (!trimmedTag) return
    if (value.length >= maxTags) return
    if (value.includes(trimmedTag)) {
      // Tag already exists, clear input
      setInputValue("")
      return
    }

    // Add tag
    onChange([...value, trimmedTag])
    setInputValue("")
  }

  const handleKeyDown = (e) => {
    if (disabled) return

    // Add tag on Enter or Comma
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag(inputValue)
    }

    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      const newTags = [...value]
      newTags.pop()
      onChange(newTags)
    }
  }

  const handleRemoveTag = (indexToRemove) => {
    if (disabled) return
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className={cn(
        "min-h-[2.5rem] w-full rounded-md border border-input bg-background",
        "px-3 py-2 text-sm ring-offset-background",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "cursor-text transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleContainerClick}
    >
      <div className="flex flex-wrap gap-1.5 items-center">
        {/* Existing Tags */}
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="pl-2 pr-1 py-0.5 gap-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Tag className="h-3 w-3" />
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveTag(index)
                }}
                className="ml-0.5 rounded-sm hover:bg-primary/30 p-0.5 transition-colors"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        {/* Input Field */}
        {!disabled && value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // Add tag on blur if there's content
              if (inputValue.trim()) {
                handleAddTag(inputValue)
              }
            }}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
            disabled={disabled}
          />
        )}
      </div>

      {/* Helper text */}
      {!disabled && (
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter or comma to add tags{value.length > 0 && ` • ${value.length}/${maxTags} tags`}
        </p>
      )}
    </div>
  )
}
