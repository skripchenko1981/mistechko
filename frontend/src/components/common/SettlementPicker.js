import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../ui/input';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const defaultSettlements = ['с. Зелене', 'мкр. Сонячний', 'Громада'];

export function SettlementPicker({ id, value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settlements, setSettlements] = useState(defaultSettlements);

  useEffect(() => {
    fetch(`${API_URL}/api/products/locations`)
      .then((response) => (response.ok ? response.json() : []))
      .then((locations) => {
        if (Array.isArray(locations)) {
          setSettlements([...new Set([...defaultSettlements, ...locations])]);
        }
      })
      .catch(() => {
        // Default suggestions remain available if the API is temporarily unavailable.
      });
  }, []);

  const filteredSettlements = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return settlements;
    return settlements.filter((settlement) => settlement.toLowerCase().includes(query));
  }, [settlements, value]);

  const selectSettlement = (settlement) => {
    onChange(settlement);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#27ae60]" />
      <Input
        id={id}
        value={value}
        maxLength={80}
        placeholder="Почніть вводити населений пункт"
        autoComplete="off"
        className={`pl-9 ${className}`}
        onFocus={() => setIsOpen(true)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-md border border-[#cbd5e1] bg-white p-1 shadow-lg">
          {filteredSettlements.map((settlement) => (
            <button
              key={settlement}
              type="button"
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-[#1e3a5f] hover:bg-[#e8f6ed]"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSettlement(settlement)}
            >
              <MapPin className="h-4 w-4 text-[#27ae60]" />
              {settlement}
            </button>
          ))}
          {value.trim() && !settlements.some((settlement) => settlement.toLowerCase() === value.trim().toLowerCase()) && (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-[#e67e22] hover:bg-orange-50"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSettlement(value.trim())}
            >
              <span className="text-base">＋</span>
              Додати «{value.trim()}»
            </button>
          )}
          {!filteredSettlements.length && !value.trim() && (
            <p className="px-3 py-2 text-sm text-gray-500">Введіть населений пункт вручну</p>
          )}
        </div>
      )}
    </div>
  );
}
