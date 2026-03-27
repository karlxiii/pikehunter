"use client";

import { useState, useRef, useEffect } from "react";
import { SPECIES } from "@/lib/species";
import { useT } from "@/lib/i18n";

export default function SpeciesInput({
  name,
  defaultValue,
  value,
  onChange,
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [input, setInput] = useState(value ?? defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

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
      setFiltered(SPECIES.filter((s) => s.toLowerCase().includes(lower)));
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function handleSelect(species: string) {
    setInput(species);
    onChange?.(species);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        name={name}
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t("common.searchPlaceholder")}
        autoComplete="off"
        required
        className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filtered.map((s) => (
            <li
              key={s}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
