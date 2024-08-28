"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type PaginationTableState = {
  pagination: PaginationState;
};

export type PaginationInitialTableState = {
  pagination?: Partial<PaginationState>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // manualPagination: true,
    pageCount: -1,
  });

  return (
    <div className="">
      <Table>
        <TableHeader className="bg-[#FBFBFB]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-4 py-4">
        <Button
          variant="outline"
          size="sm"
          className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-main-100"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span>
            <ArrowLeft2 size="20" />
          </span>
          Prev
        </Button>
        <div className="space-x-3">
          <Button variant="outline" className="h-6 w-6 p-2 text-sm">
            1
          </Button>
          <Button variant="outline" className="h-6 w-6 p-2 text-sm">
            2
          </Button>
          <Button variant="outline" className="h-6 w-6 p-2 text-sm">
            3
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-main-100"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next{" "}
          <span>
            <ArrowRight2 size="20" />
          </span>
        </Button>
      </div>
    </div>
  );
}

export default DataTable;
