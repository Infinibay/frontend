"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const InputSelector = ({
  items = [],
  selectedItem = null,
  className,
  onSelectItem,
  placeholder = "Select item",
  searchPlaceholder = "Search...",
  itemLabelKey = "name",
  itemValueKey = "id",
  displayValue,
  renderItem,
}) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filteredItems, setFilteredItems] = useState(items)
  const inputRef = useRef(null)

  // Filter items based on search input
  useEffect(() => {
    if (searchValue) {
      const filtered = items.filter(item => 
        String(item[itemLabelKey]).toLowerCase().includes(searchValue.toLowerCase())
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(items)
    }
  }, [searchValue, items, itemLabelKey])

  // Handle selection
  const handleSelect = (item) => {
    setOpen(false)
    setSearchValue("")
    
    if (onSelectItem) {
      onSelectItem(item)
    }
  }

  // Get the display text for the button
  const getDisplayText = () => {
    if (!selectedItem) return placeholder
    
    if (displayValue) {
      return displayValue(selectedItem)
    }
    
    return selectedItem[itemLabelKey]
  }

  // Get the label text for an item
  const getItemLabel = (item) => {
    return String(item[itemLabelKey])
  }

  // Check if an item is selected
  const isItemSelected = (item) => {
    if (!selectedItem) return false
    
    if (typeof selectedItem === 'object') {
      return selectedItem[itemValueKey] === item[itemValueKey]
    }
    
    return selectedItem === item[itemValueKey]
  }

  // Default item renderer
  const defaultRenderItem = (item) => (
    <div className="flex items-center">
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          isItemSelected(item) ? "opacity-100" : "opacity-0"
        )}
      />
      <span className="flex-grow text-left">{getItemLabel(item)}</span>
    </div>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-white dark:bg-gray-800", className)}
        >
          <div className="flex items-center truncate">
            {getDisplayText()}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 overflow-visible bg-white dark:bg-gray-800" align="start">
        <div className="flex flex-col w-full">
          <div className="flex items-center border-b px-3 py-2 bg-white dark:bg-gray-800">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 border-none outline-none focus:ring-0 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-800">
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-sm">No items found</div>
            ) : (
              <div className="p-1 bg-white dark:bg-gray-800">
                {filteredItems.map((item) => (
                  <button
                    key={item[itemValueKey]}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:cursor-pointer",
                      isItemSelected(item) ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    {renderItem ? renderItem(item, isItemSelected(item)) : defaultRenderItem(item)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { InputSelector }