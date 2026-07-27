"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Reusable Form Field Components
 * 
 * Consistent form inputs with labels, validation, and error messages
 * for use across all roles and modules.
 */

// Base field props
type BaseFieldProps = {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

// Input Field
export type InputFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;

export function InputField({
  label,
  error,
  hint,
  required,
  className = "",
  ...inputProps
}: InputFieldProps) {
  const inputId = inputProps.id || inputProps.name;
  
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        required={required}
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-border"
        } bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50`}
        {...inputProps}
      />
      
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// Textarea Field
export type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaField({
  label,
  error,
  hint,
  required,
  className = "",
  rows = 4,
  ...textareaProps
}: TextareaFieldProps) {
  const textareaId = textareaProps.id || textareaProps.name;
  
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        required={required}
        rows={rows}
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-border"
        } bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50`}
        {...textareaProps}
      />
      
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// Select Field
export type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ value: string | number; label: string }>;
    placeholder?: string;
  };

export function SelectField({
  label,
  error,
  hint,
  required,
  className = "",
  options,
  placeholder,
  ...selectProps
}: SelectFieldProps) {
  const selectId = selectProps.id || selectProps.name;
  
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`w-full appearance-none rounded-lg border ${
            error ? "border-red-500" : "border-border"
          } bg-background px-3 py-2 pr-10 text-sm text-foreground transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50`}
          {...selectProps}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// Checkbox Field
export type CheckboxFieldProps = Omit<BaseFieldProps, "label"> &
  InputHTMLAttributes<HTMLInputElement> & {
    label: ReactNode;
  };

export function CheckboxField({
  label,
  error,
  hint,
  className = "",
  ...inputProps
}: CheckboxFieldProps) {
  const inputId = inputProps.id || inputProps.name;
  
  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        <input
          id={inputId}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border bg-background text-primary transition-colors focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          {...inputProps}
        />
        <label
          htmlFor={inputId}
          className="text-sm text-foreground cursor-pointer"
        >
          {label}
        </label>
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// File Upload Field
export type FileFieldProps = BaseFieldProps & {
  accept?: string;
  onChange?: (file: File | null) => void;
  currentFileName?: string;
};

export function FileField({
  label,
  error,
  hint,
  required,
  className = "",
  accept,
  onChange,
  currentFileName,
  ...inputProps
}: FileFieldProps) {
  const inputId = inputProps.id || "file-upload";
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange?.(file);
  };
  
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type="file"
        accept={accept}
        required={required}
        onChange={handleChange}
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-border"
        } bg-background px-3 py-2 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50`}
        {...inputProps}
      />
      
      {currentFileName && (
        <p className="mt-1 text-xs text-muted-foreground">
          Current: {currentFileName}
        </p>
      )}
      
      {hint && !error && !currentFileName && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
