"use client";

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
  type ColumnDef,
} from "@tanstack/react-table";
import * as React from "react";

import { useTableState } from "@/hooks/use-table-state";
import { SimpleDataTablePagination } from "@/components/ui/simple-data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TABLE_CONFIG } from "@/lib/config/table-config";
import { cn } from "@/lib/utils";

interface SearchConfig<TData> {
  placeholder?: string;
  searchFn?: (
    row: Row<TData>,
    columnId: string,
    filterValue: string
  ) => boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  searchConfig?: SearchConfig<TData>;
  toolbar?: React.ReactNode;
  headerClassName?: string;
  rowClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorMessage = "Une erreur est survenue lors du chargement des données.",
  emptyMessage = "Aucune donnée trouvée",
  searchConfig,
  toolbar,
  headerClassName,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const safeData = data ?? [];

  const tableState = useTableState();

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting: tableState.sorting,
      columnVisibility: tableState.columnVisibility,
      rowSelection: tableState.rowSelection,
      columnFilters: tableState.columnFilters,
      globalFilter: tableState.globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: tableState.setRowSelection,
    onSortingChange: tableState.setSorting,
    onColumnFiltersChange: tableState.setColumnFilters,
    onColumnVisibilityChange: tableState.setColumnVisibility,
    onGlobalFilterChange: tableState.setGlobalFilter,
    globalFilterFn: searchConfig?.searchFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  /**
   * Helper to opt-out of React Compiler memoization for TanStack Table calls.
   *
   * TanStack Table mutates state in-place instead of creating new references,
   * which conflicts with React Compiler's automatic memoization. This causes
   * stale values when the compiler wraps calls like table.getHeaderGroups()
   * in useMemo with [table] as dependency (table reference never changes).
   *
   * See: https://github.com/facebook/react/issues/33057#issuecomment-2894450792
   */
  const useNoMemo = <const T,>(factory: () => T): T => {
    "use no memo";
    return factory();
  };

  // Extract table state reads with React Compiler opt-out to prevent stale values
  const headerGroups = useNoMemo(() => table.getHeaderGroups());
  const rowModel = useNoMemo(() => table.getRowModel());

  return (
    <div className="space-y-4">
      {toolbar}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className={cn(headerClassName)}>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: TABLE_CONFIG.LOADING_ROWS }).map(
                (_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : rowModel.rows?.length ? (
              rowModel.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("hover:bg-muted/50", rowClassName)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div
                    className={`text-center ${
                      isError ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {isError ? errorMessage : emptyMessage}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <SimpleDataTablePagination table={table} />
    </div>
  );
}
