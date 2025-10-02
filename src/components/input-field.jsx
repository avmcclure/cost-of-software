import React from 'react';
import { UNIT_SECONDS } from '../utils/unitSeconds';
import { TimeUnit } from '../utils/timeUnit';

const units = Object.keys(UNIT_SECONDS);

export default function InputField({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  hideUnit = false,
  unitOptions,
}) {
  const options = unitOptions || units;
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={value}
          min="0"
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onValueChange(Number.isFinite(v) ? v : 0);
          }}
        />
        {!hideUnit && (
          <select
            className="border rounded p-2 w-1/3"
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
          >
            {options.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
