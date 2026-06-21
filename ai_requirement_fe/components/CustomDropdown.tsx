"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  icon: React.ElementType;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export default function CustomDropdown({ icon: Icon, value, options, onChange, placeholder, className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${isOpen ? 'z-50' : 'z-40'} ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center w-full px-4 py-2.5 bg-slate-100/80 rounded-lg border border-transparent hover:bg-white focus-within:border-blue-400 focus-within:bg-white transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="size-5 text-slate-400 mr-2 shrink-0" />
        <div className="flex-1 truncate text-slate-700 font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <ChevronDown className={`size-4 text-slate-400 ml-2 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 overflow-y-auto max-h-60">
          <div 
            className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium ${value === "" ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
            onClick={() => { onChange(""); setIsOpen(false); }}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div 
              key={opt.value} 
              className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium ${value === opt.value ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
