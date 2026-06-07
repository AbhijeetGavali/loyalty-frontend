"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export function CustomSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the currently active selection label
  const selectedOption = options.find((opt) => opt.value === value);

  // Close the select menu matrix automatically if the operator clicks outside the container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-1.5 text-left">
      {label && (
        <label className="text-xs font-bold text-stone-300 tracking-wide block">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button Interface Field */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full h-11 px-3.5 rounded-xl bg-[#0C0A09] border text-sm flex items-center justify-between text-left transition-all outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 ${
            isOpen
              ? "border-amber-500/50 ring-1 ring-amber-500/20"
              : "border-stone-800/80"
          } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`truncate ${selectedOption ? "text-stone-100 font-medium" : "text-stone-600"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`size-4 text-stone-500 transition-transform duration-300 shrink-0 ml-2 ${
              isOpen ? "rotate-180 text-amber-500" : "rotate-0"
            }`}
          />
        </button>

        {/* Dropdown Options Multiplexer Layout */}
        {isOpen && !disabled && (
          <ul
            role="listbox"
            className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-stone-800/90 bg-[#14100E] p-1.5 shadow-xl shadow-black/80 animate-fade-in outline-none scrollbar-thin"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-xs text-stone-600 italic">
                No telemetry configurations found
              </li>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onValueChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 my-0.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-500 text-stone-950 font-black"
                        : "text-stone-300 hover:bg-[#0C0A09] hover:text-white"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="size-3.5 shrink-0 ml-2 stroke-[3]" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
