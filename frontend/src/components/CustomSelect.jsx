import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { BiCheck } from "react-icons/bi";

export default function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-xl border bg-white text-content-primary text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
          open
            ? "border-matcha ring-1 ring-matcha/40 shadow-xs"
            : "border-hugme-border hover:border-matcha/60"
        }`}
      >
        <span>{selectedOption?.label}</span>
        <FiChevronDown
          size={14}
          className={`text-content-muted transition-transform duration-200 ${
            open ? "rotate-180 text-matcha" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl border border-hugme-border shadow-lg p-1.5 z-30 text-xs sm:text-sm animate-dropdown-pop">
          <div className="flex flex-col gap-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-matcha-soft/40 text-matcha font-bold"
                      : "text-content-primary hover:bg-gray-100"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <BiCheck size={16} className="text-matcha shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
