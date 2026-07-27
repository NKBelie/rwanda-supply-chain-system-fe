"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import {
  PROVINCES,
  DISTRICTS,
  SECTORS,
  getDistrictsByProvince,
  getSectorsByDistrict,
  type Province,
  type District,
  type Sector,
} from "@/constants/locations";

export type LocationSelectorProps = {
  value?: {
    provinceId?: string;
    districtId?: string;
    sectorId?: string;
  };
  onChange?: (value: {
    provinceId?: string;
    districtId?: string;
    sectorId?: string;
  }) => void;
  level?: "province" | "district" | "sector";
  required?: boolean;
  disabled?: boolean;
  placeholder?: {
    province?: string;
    district?: string;
    sector?: string;
  };
  showLabels?: boolean;
  className?: string;
};

export function LocationSelector({
  value = {},
  onChange,
  level = "sector",
  required = false,
  disabled = false,
  placeholder = {},
  showLabels = true,
  className = "",
}: LocationSelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(
    value.provinceId
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    value.districtId
  );
  const [selectedSector, setSelectedSector] = useState<string | undefined>(
    value.sectorId
  );

  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);

  // Update available districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const districts = getDistrictsByProvince(selectedProvince);
      setAvailableDistricts(districts);
      
      // Reset district and sector if the previously selected district is not in the new province
      if (selectedDistrict) {
        const districtExists = districts.some((d) => d.id === selectedDistrict);
        if (!districtExists) {
          setSelectedDistrict(undefined);
          setSelectedSector(undefined);
          setAvailableSectors([]);
        }
      }
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict(undefined);
      setSelectedSector(undefined);
      setAvailableSectors([]);
    }
  }, [selectedProvince]);

  // Update available sectors when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const sectors = getSectorsByDistrict(selectedDistrict);
      setAvailableSectors(sectors);
      
      // Reset sector if the previously selected sector is not in the new district
      if (selectedSector) {
        const sectorExists = sectors.some((s) => s.id === selectedSector);
        if (!sectorExists) {
          setSelectedSector(undefined);
        }
      }
    } else {
      setAvailableSectors([]);
      setSelectedSector(undefined);
    }
  }, [selectedDistrict]);

  // Sync with external value changes
  useEffect(() => {
    if (value.provinceId !== selectedProvince) {
      setSelectedProvince(value.provinceId);
    }
    if (value.districtId !== selectedDistrict) {
      setSelectedDistrict(value.districtId);
    }
    if (value.sectorId !== selectedSector) {
      setSelectedSector(value.sectorId);
    }
  }, [value.provinceId, value.districtId, value.sectorId]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange({
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        sectorId: selectedSector,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedSector]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelectedProvince(value);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelectedDistrict(value);
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelectedSector(value);
  };

  const selectClassName =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Province Selector */}
      <div className="space-y-1.5">
        {showLabels && (
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Province
            {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            value={selectedProvince || ""}
            onChange={handleProvinceChange}
            disabled={disabled}
            required={required}
            className={selectClassName}
          >
            <option value="">
              {placeholder.province || "Select Province"}
            </option>
            {PROVINCES.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* District Selector */}
      {(level === "district" || level === "sector") && (
        <div className="space-y-1.5">
          {showLabels && (
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              District
              {required && <span className="text-destructive">*</span>}
            </label>
          )}
          <div className="relative">
            <select
              value={selectedDistrict || ""}
              onChange={handleDistrictChange}
              disabled={disabled || !selectedProvince}
              required={required}
              className={selectClassName}
            >
              <option value="">
                {placeholder.district || "Select District"}
              </option>
              {availableDistricts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {!selectedProvince && (
            <p className="text-xs text-muted-foreground">
              Please select a province first
            </p>
          )}
        </div>
      )}

      {/* Sector Selector */}
      {level === "sector" && (
        <div className="space-y-1.5">
          {showLabels && (
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Sector
              {required && <span className="text-destructive">*</span>}
            </label>
          )}
          <div className="relative">
            <select
              value={selectedSector || ""}
              onChange={handleSectorChange}
              disabled={disabled || !selectedDistrict}
              required={required}
              className={selectClassName}
            >
              <option value="">
                {placeholder.sector || "Select Sector"}
              </option>
              {availableSectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {!selectedDistrict && (
            <p className="text-xs text-muted-foreground">
              Please select a district first
            </p>
          )}
        </div>
      )}
    </div>
  );
}
