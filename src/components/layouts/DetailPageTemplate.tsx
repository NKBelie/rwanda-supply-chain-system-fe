"use client";

import { ArrowLeft, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import type { ReactNode } from "react";

/**
 * DetailPageTemplate
 * 
 * Reusable template for detail/view pages across all roles.
 * Provides consistent structure: header with actions, metadata section, content sections.
 */

export type DetailPageAction = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export type DetailPageSection = {
  title: string;
  children: ReactNode;
  className?: string;
};

export type DetailPageTemplateProps = {
  // Header
  title: string;
  subtitle?: string;
  backUrl?: string;
  backLabel?: string;
  
  // Status
  status?: string;
  statusTone?: "success" | "warning" | "danger" | "info" | "muted" | "processing";
  
  // Actions
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: DetailPageAction[];
  
  // Metadata (key-value pairs displayed in cards)
  metadata?: Array<{
    label: string;
    value: ReactNode;
    icon?: ReactNode;
  }>;
  
  // Content sections
  sections?: DetailPageSection[];
  
  // Direct children (alternative to sections)
  children?: ReactNode;
  
  // Loading/Error states
  isLoading?: boolean;
  error?: string;
};

export function DetailPageTemplate({
  title,
  subtitle,
  backUrl,
  backLabel = "Back",
  status,
  statusTone,
  onEdit,
  onDelete,
  customActions = [],
  metadata = [],
  sections = [],
  children,
  isLoading = false,
  error,
}: DetailPageTemplateProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const getActionButtonClass = (variant: string = "secondary") => {
    const baseClass = "inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors";
    
    switch (variant) {
      case "primary":
        return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`;
      case "danger":
        return `${baseClass} border border-red-600 bg-background text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20`;
      default:
        return `${baseClass} border border-border bg-background text-foreground hover:bg-surface`;
    }
  };

  return (
    <>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
            <span className="text-muted-foreground">/</span>
            <span>{title}</span>
          </div>
        }
        description={subtitle}
        actions={
          <div className="flex items-center gap-2">
            {status && (
              <StatusBadge status={status} tone={statusTone} size="md" />
            )}
            
            {onEdit && (
              <button
                onClick={onEdit}
                className={getActionButtonClass("secondary")}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
            
            {customActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={getActionButtonClass(action.variant)}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
            
            {onDelete && (
              <button
                onClick={onDelete}
                className={getActionButtonClass("danger")}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        }
      />
      
      <PageBody>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <>
            {/* Metadata Cards */}
            {metadata.length > 0 && (
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {metadata.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <div className="mt-1 text-lg font-semibold text-foreground">
                          {item.value}
                        </div>
                      </div>
                      {item.icon && (
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          {item.icon}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Content Sections */}
            {sections.length > 0 && (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border border-border bg-background p-6 shadow-sm ${section.className || ""}`}
                  >
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                      {section.title}
                    </h3>
                    {section.children}
                  </div>
                ))}
              </div>
            )}
            
            {/* Direct Children */}
            {children}
          </>
        )}
      </PageBody>
    </>
  );
}
