"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { Button, CheckboxField, MonthField, SelectField, TextArea, TextField } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState, ErrorState, FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { errorMessage, readMessage } from "@/lib/errors";
import type { FormValues } from "@/lib/forms";
import { useToast } from "@/hooks/use-toast";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "url" | "textarea" | "number" | "month" | "year" | "date" | "checkbox" | "select";
  required?: boolean;
  span?: "full";
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  list?: string;
};

type ResourceManagerProps<T extends { id: number }, B> = {
  title: string;
  description: string;
  singular: string;
  userName: string;
  load: (userName: string) => Promise<T[]>;
  create: (userName: string, body: B) => Promise<unknown>;
  update: (userName: string, id: number, body: B) => Promise<unknown>;
  remove: (userName: string, id: number) => Promise<unknown>;
  fields: FieldConfig[];
  emptyValues: FormValues;
  toForm: (item: T) => FormValues;
  fromForm: (values: FormValues) => B;
  validate?: (values: FormValues) => string | null;
  renderSummary: (item: T) => ReactNode;
  extra?: ReactNode;
};

export function ResourceManager<T extends { id: number }, B>({
  title,
  description,
  singular,
  userName,
  load,
  create,
  update,
  remove,
  fields,
  emptyValues,
  toForm,
  fromForm,
  validate,
  renderSummary,
  extra,
}: ResourceManagerProps<T, B>) {
  const formId = useId();
  const toast = useToast();
  const [items, setItems] = useState<T[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    load(userName)
      .then((next) => {
        if (!active) return;
        setItems(next ?? []);
        setStatus("ready");
        setError(null);
      })
      .catch((caught) => {
        if (!active) return;
        setStatus("error");
        setError(errorMessage(caught, "The records could not be loaded."));
      });
    return () => {
      active = false;
    };
  }, [userName, load, reloadKey]);

  function updateValue(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (editingId === null) return;
    const validationMessage = validate?.(values) ?? null;
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      const body = fromForm(values);
      const result = editingId === "new" ? await create(userName, body) : await update(userName, editingId, body);
      const next = await load(userName);
      setItems(next ?? []);
      setEditingId(null);
      setValues(emptyValues);
      toast.success(readMessage(result, "Saved."));
    } catch (caught) {
      setFormError(errorMessage(caught, "The record could not be saved."));
    } finally {
      setPending(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const result = await remove(userName, pendingDelete.id);
      setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
      if (editingId === pendingDelete.id) setEditingId(null);
      setPendingDelete(null);
      toast.success(readMessage(result, "Deleted."));
    } catch (caught) {
      toast.error(errorMessage(caught, "The record could not be deleted."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="stack">
      <header className="page-intro spread">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Button
          onClick={() => {
            setEditingId("new");
            setValues({ ...emptyValues });
            setFormError(null);
          }}
        >
          Add {singular}
        </Button>
      </header>
      {extra}

      {editingId !== null ? (
        <form className="editor clay stack" onSubmit={onSubmit} noValidate>
          <h2>{editingId === "new" ? `New ${singular}` : `Edit ${singular}`}</h2>
          <FormBanner message={formError} />
          <div className="form-grid">
            {fields.map((field) => {
              const id = `${formId}-${field.name}`;
              if (field.type === "checkbox") {
                return (
                  <CheckboxField
                    key={field.name}
                    id={id}
                    label={field.label}
                    checked={values[field.name] === true}
                    onChange={(checked) => updateValue(field.name, checked)}
                  />
                );
              }
              if (field.type === "textarea") {
                return (
                  <TextArea
                    key={field.name}
                    id={id}
                    label={field.label}
                    value={String(values[field.name] ?? "")}
                    onChange={(value) => updateValue(field.name, value)}
                    required={field.required}
                    hint={field.hint}
                    span="full"
                  />
                );
              }
              if (field.type === "month") {
                return (
                  <MonthField
                    key={field.name}
                    id={id}
                    label={field.label}
                    value={String(values[field.name] ?? "")}
                    onChange={(value) => updateValue(field.name, value)}
                  />
                );
              }
              if (field.type === "select") {
                return (
                  <SelectField
                    key={field.name}
                    id={id}
                    label={field.label}
                    value={String(values[field.name] ?? "")}
                    onChange={(value) => updateValue(field.name, value)}
                    options={field.options ?? []}
                    required={field.required}
                    span={field.span}
                  />
                );
              }
              const inputType = field.type === "year" ? "number" : field.type;
              return (
                <TextField
                  key={field.name}
                  id={id}
                  label={field.label}
                  type={inputType}
                  value={String(values[field.name] ?? "")}
                  onChange={(value) => updateValue(field.name, value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  hint={field.hint}
                  span={field.span}
                  list={field.list}
                  min={field.type === "year" ? 1900 : undefined}
                  max={field.type === "year" ? 2100 : undefined}
                />
              );
            })}
          </div>
          <div className="row">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
            <Button variant="secondary" onClick={() => setEditingId(null)} disabled={pending}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {status === "loading" ? <LoadingBlock label={`Loading ${title.toLowerCase()}`} /> : null}
      {status === "error" ? <ErrorState message={error ?? "The records could not be loaded."} onRetry={() => { setStatus("loading"); setReloadKey((value) => value + 1); }} /> : null}
      {status === "ready" && items.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description={`Add a ${singular} when you are ready to show it on the portfolio.`} />
      ) : null}
      {status === "ready" && items.length > 0 ? (
        <div className="record-list">
          {items.map((item) => (
            <article key={item.id} className="record-card clay">
              <div>{renderSummary(item)}</div>
              <div className="row">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingId(item.id);
                    setValues(toForm(item));
                    setFormError(null);
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setPendingDelete(item)}>
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete this ${singular}?`}
        description="This removes the record from the portfolio. The action cannot be undone from the studio."
        confirmLabel="Delete"
        pending={deleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
      />
    </section>
  );
}
