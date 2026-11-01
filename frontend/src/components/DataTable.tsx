import type { ReactNode } from "react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  loading = false,
  emptyTitle,
  emptyDescription,
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  rowKey: (row: T) => string;
}) {
  if (loading && rows.length === 0) {
    return <LoadingState />;
  }

  if (!loading && rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full table-fixed border-separate border-spacing-0 text-left text-[13px]">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-2.5 py-2.5 text-[13px] font-semibold tracking-[0.01em] text-slate-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-slate-100 align-middle hover:bg-slate-50/80">
              {columns.map((column) => (
                <td key={column.key} className={`min-w-0 px-2.5 py-2.5 align-middle text-[13px] text-slate-800 ${column.className ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
