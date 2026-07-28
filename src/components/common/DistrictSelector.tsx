"use client";

import { ChevronDown } from "lucide-react";
import { DISTRICTS, getDistrictsSorted } from "@/constants/locations";

export type DistrictSelectorProps = {
  value?: string;
  onChange?: (districtId: string | undefined) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showAllOption?: boolean;
};

/**
 * Simplified district-only selector for quick filtering
 */
export function DistrictSelector({
  value,
  onChange,
  placeholder = "All Districts",
  required = false,
  disabled = false,
  className = "",
  showAllOption = true,
}: DistrictSelectorProps) {
  const sortedDistricts = getDistrictsSorted();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value || undefined;
    onChange?.(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {showAllOption && <option value="">{placeholder}</option>}
        {sortedDistricts.map((district) => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
