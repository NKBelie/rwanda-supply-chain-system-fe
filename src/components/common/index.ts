/**
 * Standardized Common Components
 * 
 * Export all reusable common components from a single location
 * to ensure consistency across all dashboards and roles.
 */

// Status and State Components
export { StatusBadge } from "./StatusBadge";
export type { StatusBadgeProps, StatusTone } from "./StatusBadge";

export { EmptyState } from "./empty-state/EmptyState";
export type { EmptyStateProps } from "./empty-state/EmptyState.types";

export { LoadingState } from "./loading-state/LoadingState";

// Location Components
export { LocationSelector } from "./LocationSelector";
export type { LocationSelectorProps } from "./LocationSelector";

export { DistrictSelector } from "./DistrictSelector";
export type { DistrictSelectorProps } from "./DistrictSelector";
