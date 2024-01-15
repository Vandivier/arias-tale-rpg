import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { BarsArrowUpIcon, BarsArrowDownIcon } from "@heroicons/react/16/solid";
import classNames from 'classnames';

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

import { useRouter } from "next/router";
import React from "react";
import type { SearchableImageWithGameCard } from "~/server/api/routers/searchableImageRouter";
import { api } from "~/utils/api";
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

export function tagPill({ value }) {
  const tag = value ? value.toLowerCase() : "common";

  const raceOptions = ["celestial", "troll", "bug", "monster"];
  const characterOptions = ["caelum", "elara", "lyra", "tank", "battler"];
  const fightingOptions = ["dual-wield", "healing", "melee", "ranged"];
  const magicOptions = ["elemental", "fire", "magic", "thunder"];

  let tagClass = '';

  if (raceOptions.includes(tag)) {
    tagClass = 'bg-yellow-100 text-yellow-700';
  } else if (characterOptions.includes(tag)) {
    tagClass = 'bg-blue-100 text-blue-700';
  } else if (fightingOptions.includes(tag)) {
    tagClass = 'bg-green-100 text-green-700';
  } else if (magicOptions.includes(tag)) {
    tagClass = 'bg-red-100 text-red-700';
  } else {
    tagClass = 'bg-gray-100 text-gray-700';
  }

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
        "flex items-center justify-center", // Flexbox classes for vertical alignment
        "whitespace-nowrap overflow-hidden text-overflow-ellipsis",
        tagClass
      )}
    >
      {tag !== 'common' ? value : 'Common'}
    </span>
  );
}


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
    // cell: ({ row }) => {
    //   const tags: string[] = row.getValue("tags");
    //   // return tags.join(", ");
    //   return tags.map((tag) => tagPill({ value: tag })).join(" ");
    // },
    cell: ({ row }) => {
      const tags: string[] = row.getValue("tags");
      return (
        <div style={{ display: 'flex', gap: '4px' }}>
          {tags.map((tag, index) => (
            <React.Fragment key={index}>
              {tagPill({ value: tag })}
            </React.Fragment>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "battlerHealth",
    cell: ({ row }) => row.original.gameCard?.battlerHealth ?? "N/A",
    enableSorting: true,
    sortUndefined: 1,
    header: () => "Battler Health",
    sortingFn: (rowA, rowB) => {
      const numA = rowA.original.gameCard?.battlerHealth ;
      const numB = rowB.original.gameCard?.battlerHealth ;
      return numA - numB;
    },
  },
  {
    accessorKey: "battlerPower",
    cell: ({ row }) => row.original.gameCard?.battlerPower ?? "N/A",
    enableSorting: true,
    sortUndefined: 1,
    header: () => "Battler Power",
    sortingFn: (rowA, rowB) => {
      const numA = rowA.original.gameCard?.battlerPower ;
      const numB = rowB.original.gameCard?.battlerPower ;
      return numA - numB;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const imageId = row.original.id;

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
            <DropdownMenuItem
              onClick={async () => await router.push(`/gallery/${imageId}`)}
            >
              View Image Details
            </DropdownMenuItem>
            <DropdownMenuItem disabled={true}>
              View Game Card Details
            </DropdownMenuItem>
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
    React.useState<VisibilityState>({
      battlerHealth: false,
      battlerPower: false,
      id: false,
      tags: false,
    });
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

                  return (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none tracking-wider text-white table-header"
                      onClick={() => header.column.toggleSorting()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="header-flex">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sortingState === "asc" ? (
                            <BarsArrowDownIcon className="h-4 w-4" />
                          ) : sortingState === "desc" ? (
                            <BarsArrowUpIcon className="h-4 w-4" />
                          ) : null}
                        </div>
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
