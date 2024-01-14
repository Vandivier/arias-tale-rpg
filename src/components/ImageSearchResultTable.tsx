import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { api } from "~/utils/api";
import type { SearchableImageWithGameCard } from "~/server/api/routers/searchableImageRouter";

export const columns: ColumnDef<SearchableImageWithGameCard>[] = [
  {
    accessorKey: "id",
    enableSorting: true,
    header: () => "ID",
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "title",
    enableSorting: true,
    header: () => "Title",
    cell: ({ row }) => row.getValue("title"),
  },
  {
    accessorKey: "description",
    enableSorting: true,
    header: () => "Description",
    cell: ({ row }) => row.getValue("description"),
  },
  {
    accessorKey: "tags",
    header: () => "Tags",
    cell: ({ row }) => {
      const tags: string[] = row.getValue("tags");
      return tags.join(", ");
    },
  },
  {
    accessorKey: "battlerHealth",
    cell: ({ row }) => row.original.gameCard?.battlerHealth ?? "N/A",
    enableSorting: true,
    header: () => "Battler Health",
    sortingFn: (rowA, rowB) => {
      const numA = rowA.original.gameCard?.battlerHealth ?? -1;
      const numB = rowB.original.gameCard?.battlerHealth ?? -1;
      return numA - numB;
    },
  },
  {
    accessorKey: "battlerPower",
    enableSorting: true,
    header: () => "Battler Power",
    cell: ({ row }) => row.original.gameCard?.battlerPower ?? "N/A",
    sortingFn: (rowA, rowB) => {
      const numA = rowA.original.gameCard?.battlerPower ?? -1;
      const numB = rowB.original.gameCard?.battlerPower ?? -1;
      return numA - numB;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Image Details</DropdownMenuItem>
            <DropdownMenuItem>View Game Card Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ImageSearchResultTable() {
  const [tableFilterCurrInput, setTableFilterCurrInput] = React.useState("");
  const [tableFilterForNetworkCall, setTableFilterForNetworkCall] =
    React.useState("");
  const { data, isLoading, isError, refetch } = api.image.getImages.useQuery(
    { filter: tableFilterForNetworkCall },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    columns,
    data: data ?? [],

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) {
    return (
      <span>😭 An error occured while trying to obtain the image. 😭</span>
    );
  }

  const handleResetClick = async () => {
    setTableFilterForNetworkCall("");
    await refetch();
  };

  const handleSearchClick = async () => {
    setTableFilterForNetworkCall(tableFilterCurrInput);
    await refetch();
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter by title, description, or tags..."
          value={tableFilterCurrInput}
          onChange={(event) =>
            setTableFilterCurrInput(event.target.value || "")
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearchClick();
            }
          }}
          className="max-w-sm"
        />

        <Button
          variant="secondary"
          className="ml-auto"
          onClick={handleSearchClick}
        >
          Search
        </Button>

        <Button
          variant="secondary"
          className="ml-auto"
          onClick={handleResetClick}
        >
          Reset Search
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortingState = header.column.getIsSorted();
                  const sortingIconRotation =
                    sortingState === "desc" ? "rotate-180" : "";

                  return (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none tracking-wider text-white"
                      onClick={() => header.column.toggleSorting()}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <ChevronDownIcon
                            className={`ml-2 h-4 w-4 transform ${
                              sortingState ? sortingIconRotation : "opacity-0"
                            }`}
                          />
                        </>
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
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
