import { useEffect, useMemo, useState } from "react";
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import type { z } from "zod";
import { AlertMessage } from "@/components/AlertMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DataTable, type Column } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { FormDialog } from "@/components/shared/FormDialog";
import { Pagination } from "@/components/shared/Pagination";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/auth/AuthContext";
import { canMutate } from "@/lib/permissions";

const PAGE_SIZE = 8;

export interface FieldSpec {
  name: string;
  label: string;
  type: "text" | "email" | "date" | "number" | "select" | "time";
  options?: { value: string; label: string }[];
  step?: string;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function ResourceManager<T extends { id: number | string }, TSchema extends z.ZodType<FieldValues>>({
  title,
  entityName,
  description,
  columns,
  fields,
  schema,
  defaults,
  list,
  create,
  update,
  remove,
  searchKeys,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  entityName: string;
  description: string;
  columns: Column<T>[];
  fields: FieldSpec[];
  schema: TSchema;
  defaults: DefaultValues<z.infer<TSchema>>;
  list: () => Promise<T[]>;
  create: (values: z.infer<TSchema>) => Promise<unknown>;
  update: (id: number | string, values: z.infer<TSchema>) => Promise<unknown>;
  remove: (id: number | string) => Promise<void>;
  searchKeys: (row: T) => string[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const { user } = useAuth();
  const allowMutate = canMutate(user?.role) || !user;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<any>({
    resolver: async (values) => {
      const result = schema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      return {
        values: {},
        errors: result.error.issues.reduce<Record<string, { type: string; message: string }>>((acc, issue) => {
          const key = issue.path.length > 0 ? issue.path.join(".") : "_root";
          acc[key] = { type: issue.code, message: issue.message };
          return acc;
        }, {}),
      };
    },
    defaultValues: defaults,
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setRows(await list());
    } catch (reason) {
      setRows([]);
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // Service functions are module-level; reload is triggered after mutations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return rows;
    }
    return rows.filter((row) => searchKeys(row).some((value) => value.toLowerCase().includes(needle)));
  }, [query, rows, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditing(null);
    form.reset(defaults);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    form.reset({ ...defaults, ...row });
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSave() {
    const valid = await form.trigger();
    if (!valid || busy) {
      return;
    }
    setBusy(true);
    setFormError(null);
    try {
      const values = form.getValues();
      if (editing) {
        await update(editing.id, values);
      } else {
        await create(values);
      }
      setFormOpen(false);
      await refresh();
    } catch (reason) {
      setFormError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete || busy) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await remove(pendingDelete.id);
      setPendingDelete(null);
      await refresh();
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  const tableColumns: Column<T>[] = [
    ...columns,
    ...(allowMutate
      ? [
          {
            key: "actions",
            header: "Actions",
            render: (row: T) => (
              <div className="flex gap-3">
                <button type="button" className="text-sm font-medium text-sky-700 hover:underline" onClick={() => openEdit(row)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-red-700 hover:underline"
                  onClick={() => setPendingDelete(row)}
                >
                  Delete
                </button>
              </div>
            ),
          } satisfies Column<T>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          allowMutate ? (
            <Button type="button" onClick={openCreate}>
              Add
            </Button>
          ) : null
        }
      />
      {error ? (
        <div className="mb-4">
          <AlertMessage>{error}</AlertMessage>
        </div>
      ) : null}
      <SearchFilterBar value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder={`Search ${title.toLowerCase()}`} />
      <DataTable
        columns={tableColumns}
        rows={paged}
        loading={loading}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        rowKey={(row) => String(row.id)}
      />
      <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} onPageChange={setPage} />
      <FormDialog
        open={formOpen}
        title={editing ? `Edit ${entityName}` : `Add ${entityName}`}
        busy={busy}
        onClose={() => setFormOpen(false)}
        onSubmit={() => {
          void handleSave();
        }}
      >
        {fields.map((field) => {
          const name = field.name as Path<z.infer<TSchema>>;
          const message = form.formState.errors[name]?.message;
          return (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "select" ? (
                <Select id={field.name} {...form.register(name)}>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  step={field.step}
                  {...form.register(name)}
                />
              )}
              {typeof message === "string" ? <p className="mt-1 text-xs text-red-700">{message}</p> : null}
            </div>
          );
        })}
        {formError ? <AlertMessage>{formError}</AlertMessage> : null}
      </FormDialog>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${entityName.toLowerCase()}`}
        description="This action cannot be undone. The backend remains the authority for whether the record is removed."
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
}
