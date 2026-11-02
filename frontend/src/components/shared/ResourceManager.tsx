import { type ReactNode, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Building2, Mail, ShieldCheck, User, X } from "lucide-react";
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
  readOnly?: boolean;
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
  renderActions,
  detailFields,
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
  renderActions?: (row: T, actions: { onView: () => void; onEdit: () => void; onDelete: () => void }) => ReactNode;
  detailFields?: (row: T) => { label: string; value: ReactNode }[];
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
  const [viewing, setViewing] = useState<T | null>(null);

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

  const watchedValues = form.watch(["gross_pay", "deductions", "net_pay"]);

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

  useEffect(() => {
    const hasPayrollFields = fields.some((field) => field.name === "gross_pay") && fields.some((field) => field.name === "deductions") && fields.some((field) => field.name === "net_pay");
    if (!hasPayrollFields) {
      return;
    }

    const grossValue = Number(form.getValues("gross_pay") ?? 0);
    const deductionsValue = Number(form.getValues("deductions") ?? 0);
    const nextNetPay = Math.max(0, grossValue - deductionsValue);
    const currentNetPay = Number(form.getValues("net_pay") ?? 0);

    if (Math.abs(currentNetPay - nextNetPay) > 0.01) {
      form.setValue("net_pay", nextNetPay, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [fields, form, watchedValues]);

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
            header: <div className="flex justify-end pr-1.5">Actions</div>,
            headerClassName: "w-[22%] text-right",
            className: "w-[22%] min-w-[90px] pr-2 text-right align-middle",
            render: (row: T) =>
              renderActions ? (
                <div className="flex w-full justify-end pr-0.5 lg:pr-1.5">{renderActions(row, {
                  onView: () => setViewing(row),
                  onEdit: () => openEdit(row),
                  onDelete: () => setPendingDelete(row),
                })}</div>
              ) : (
                <div className="flex justify-end gap-3 pr-1">
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
    <div className="w-full overflow-visible">
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
                  readOnly={field.readOnly}
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
        description={
          pendingDelete && "name" in pendingDelete
            ? `Delete ${String((pendingDelete as { name?: string }).name ?? entityName.toLowerCase())}? This action cannot be undone.`
            : "This action cannot be undone. The backend remains the authority for whether the record is removed."
        }
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          void handleDelete();
        }}
      />
      {viewing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-3 sm:p-4">
          <button type="button" className="absolute inset-0" aria-label="Close employee details" onClick={() => setViewing(null)} />
          <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
              <h2 className="text-[18px] font-semibold text-slate-900">Employee Details</h2>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Close employee details"
                onClick={() => setViewing(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-0 md:grid-cols-[190px_minmax(0,1fr)]">
              <div className="border-b border-slate-200 px-3 py-4 text-center md:border-b-0 md:border-r md:px-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-base font-semibold text-sky-700">
                    {String((viewing as { name?: string }).name ?? "?").split(" ").slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "?"}
                  </div>
                  <p className="mt-2 text-[18px] font-semibold text-slate-900 sm:text-[18px]">
                    {String((viewing as { employee_name?: string; name?: string }).employee_name ?? (viewing as { name?: string }).name ?? "Unknown")}
                  </p>
                  <div className="mt-2">
                    {String((viewing as { status?: string }).status ?? "active").toLowerCase() === "active" ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[12px] font-semibold text-emerald-900">Active</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[12px] font-semibold text-red-800">Inactive</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="min-w-0 px-3 py-3 sm:px-4">
                <div className="space-y-2">
                  {(detailFields ? detailFields(viewing) : [{ label: "Name", value: String((viewing as { name?: string }).name ?? "") }]).map((field, index) => {
                    const label = String(field.label).toLowerCase();
                    const icon = label.includes("email")
                      ? <Mail className="h-3.5 w-3.5" />
                      : label.includes("job")
                        ? <BriefcaseBusiness className="h-3.5 w-3.5" />
                        : label.includes("department")
                          ? <Building2 className="h-3.5 w-3.5" />
                          : label.includes("status")
                            ? <ShieldCheck className="h-3.5 w-3.5" />
                            : <User className="h-3.5 w-3.5" />;

                    return (
                      <div key={field.label ?? index} className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">{icon}</div>
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <p className="w-24 shrink-0 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500">{field.label}</p>
                          <div className="min-w-0 flex-1 text-[13px] leading-5 text-slate-800">{field.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
