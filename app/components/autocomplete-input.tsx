"use client";

import { useState, useRef, useEffect } from "react";

export type SuggestionItem = string | { label: string; value: string; displayValue?: string };

function getLabel(item: SuggestionItem): string {
  return typeof item === "string" ? item : item.label;
}

function getValue(item: SuggestionItem): string {
  return typeof item === "string" ? item : item.value;
}

function getDisplayValue(item: SuggestionItem): string {
  if (typeof item === "string") return item;
  return item.displayValue ?? item.value;
}

export default function AutocompleteInput({
  name,
  defaultValue,
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder = "Type to search...",
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (item: SuggestionItem) => void;
  suggestions: SuggestionItem[];
  placeholder?: string;
}) {
  const [input, setInput] = useState(value ?? defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<SuggestionItem[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setInput(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(val: string) {
    setInput(val);
    onChange?.(val);
    if (val.length >= 1) {
      const lower = val.toLowerCase();
      setFiltered(suggestions.filter((s) => {
        const label = getLabel(s).toLowerCase();
        const value = getValue(s).toLowerCase();
        return label.includes(lower) || value.includes(lower);
      }));
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function handleSelect(item: SuggestionItem) {
    const display = getDisplayValue(item);
    setInput(display);
    onChange?.(display);
    onSelect?.(item);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        name={name}
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filtered.map((s) => (
            <li
              key={getValue(s)}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {getLabel(s)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
