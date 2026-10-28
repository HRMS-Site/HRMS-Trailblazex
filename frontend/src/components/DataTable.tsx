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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-slate-100 hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={column.key} className={`whitespace-nowrap px-4 py-3 text-slate-800 ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
