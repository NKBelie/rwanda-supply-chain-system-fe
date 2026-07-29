"use client";

import { ArrowLeft, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import type { ReactNode, FormEvent } from "react";

/**
 * FormTemplate
 * 
 * Reusable template for create/edit forms across all roles.
 * Provides consistent structure: header with actions, form sections, validation.
 */

export type FormSection = {
  title: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2 | 3;
};

export type FormTemplateProps = {
  // Header
  title: string;
  subtitle?: string;
  backUrl?: string;
  backLabel?: string;
  
  // Form handling
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancel?: () => void;
  
  // Form sections
  sections?: FormSection[];
  
  // Direct children (alternative to sections)
  children?: ReactNode;
  
  // Button labels
  submitLabel?: string;
  cancelLabel?: string;
  
  // States
  isSubmitting?: boolean;
  disabled?: boolean;
  
  // Validation
  error?: string;
  success?: string;
};

export function FormTemplate({
  title,
  subtitle,
  backUrl,
  backLabel = "Back",
  onSubmit,
  onCancel,
  sections = [],
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  disabled = false,
  error,
  success,
}: FormTemplateProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleBack();
    }
  };

  const getColumnClass = (columns: number = 1) => {
    switch (columns) {
      case 2:
        return "grid gap-4 sm:grid-cols-2";
      case 3:
        return "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "space-y-4";
    }
  };

  return (
    <>
      <div className="border-b border-border bg-background">
        <div className="px-4 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </button>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              </div>
              {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
      
      <PageBody>
        <div className="mx-auto max-w-4xl">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
              {success}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Form Sections */}
            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-background p-6 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </div>
                <div className={getColumnClass(section.columns)}>
                  {section.children}
                </div>
              </div>
            ))}
            
            {/* Direct Children */}
            {children}
            
            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 rounded-lg border border-border bg-background p-6 shadow-sm">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                {cancelLabel}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || disabled}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {submitLabel}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </PageBody>
    </>
  );
}
