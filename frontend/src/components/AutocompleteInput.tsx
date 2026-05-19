import { useState, useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
  onClear?: () => void;
}

export default function AutocompleteInput({
  value,
  onChange,
  options,
  placeholder,
  className,
  name,
  required,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value
    ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        className={`${className} ${onClear && value ? 'pr-7' : ''}`}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {onClear && value && (
        <button
          type="button"
          onClick={() => { onClear(); setOpen(false); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs leading-none"
          tabIndex={-1}
        >
          ✕
        </button>
      )}
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-md mt-1 max-h-48 overflow-y-auto text-sm">
          {filtered.map((opt) => (
            <li
              key={opt}
              onMouseDown={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
