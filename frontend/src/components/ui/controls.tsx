"use client";

import type { ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { MONTH_OPTIONS } from "@/lib/forms";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`btn btn-${variant} ${className}`.trim()} {...props} />;
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  span?: "full";
  children: ReactNode;
};

export function Field({ id, label, hint, error, required, span, children }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${span === "full" ? "span-2" : ""}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="required-mark" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div data-describedby={describedBy}>{children}</div>
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "password" | "date" | "number";
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  span?: "full";
  list?: string;
  min?: number;
  max?: number;
  maxLength?: number;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  placeholder,
  hint,
  error,
  span,
  list,
  min,
  max,
  maxLength,
}: TextFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} span={span}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        list={list}
        min={min}
        max={max}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

type TextAreaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  error?: string | null;
  rows?: number;
  maxLength?: number;
  span?: "full";
};

export function TextArea({ id, label, value, onChange, required, hint, error, rows = 5, maxLength, span = "full" }: TextAreaProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} span={span}>
      <textarea
        id={id}
        name={id}
        value={value}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  span?: "full";
};

export function SelectField({ id, label, value, onChange, options, required, span }: SelectFieldProps) {
  return (
    <Field id={id} label={label} required={required} span={span}>
      <select id={id} name={id} value={value} required={required} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

type CheckboxFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxField({ id, label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="checkbox span-2" htmlFor={id}>
      <input id={id} name={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function MonthField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return <SelectField id={id} label={label} value={value} onChange={onChange} options={MONTH_OPTIONS} />;
}

export type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement>;
export type NativeTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
