import type { ColumnDef, RowData } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/application/components/ui/button";
import { Input } from "@/application/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/application/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/application/components/ui/table";
import { features, useAppTable } from "./table-hook";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Nombre de los registros en plural, para "Mostrando 1–10 de 25 …". */
  itemLabel?: string;
  defaultPageSize?: number;
}

const PAGE_SIZES = [5, 10, 20, 50, 100];

const DataTable = <TData extends RowData>({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay resultados.",
  itemLabel = "registros",
  defaultPageSize = 10,
}: DataTableProps<TData>) => {
  const table = useAppTable({
    columns,
    data,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize: defaultPageSize } },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;

  // El total cuenta lo que queda después de la búsqueda, no todo `data`.
  const total = table.getFilteredRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(from + pageSize - 1, total);

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-card">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={table.state.globalFilter ?? ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
            // Al buscar se vuelve a la primera página, o podrías quedar en
            // una página que ya no existe con los resultados filtrados.
            table.setPageIndex(0);
          }}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {/* Borde exterior: con divisiones verticales, la tabla necesita
          cerrarse a los lados o las columnas quedan "abiertas". */}
      <div className="overflow-hidden rounded-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const SortIcon =
                    sorted === "asc"
                      ? ArrowUp
                      : sorted === "desc"
                        ? ArrowDown
                        : ArrowUpDown;

                  return (
                    <TableHead
                      key={header.id}
                      className="h-11 border-r bg-muted px-4 font-semibold last:border-r-0"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="-ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-background"
                        >
                          <table.FlexRender header={header} />
                          <SortIcon
                            className={cn(
                              "size-3.5",
                              sorted
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-r px-4 py-3 last:border-r-0"
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <span className="tabular-nums">
            {total === 0
              ? `0 ${itemLabel}`
              : `Mostrando ${from}–${to} de ${total} ${itemLabel}`}
          </span>

          <div className="flex items-center gap-2">
            <span id="page-size-label">Filas por página</span>
            <Select
              value={pageSize}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger
                size="sm"
                aria-labelledby="page-size-label"
                className="tabular-nums"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {pageCount > 1 && (
          <nav aria-label="Paginación" className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </Button>
            {getPageItems(pageIndex, pageCount).map((item, i) =>
              item === "…" ? (
                <span key={`gap-${i}`} className="w-7 text-center">
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === pageIndex ? "default" : "ghost"}
                  size="icon-sm"
                  className="tabular-nums"
                  onClick={() => table.setPageIndex(item)}
                  aria-label={`Página ${item + 1}`}
                  aria-current={item === pageIndex ? "page" : undefined}
                >
                  {item + 1}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Página siguiente"
            >
              <ChevronRight />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
};

/**
 * Qué botones de página mostrar. Con pocas páginas, todas; con muchas,
 * la primera, la última y las vecinas de la actual: 1 … 4 5 6 … 12
 */
function getPageItems(current: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);

  const items: (number | "…")[] = [0];
  const start = Math.max(1, current - 1);
  const end = Math.min(count - 2, current + 1);

  if (start > 1) items.push("…");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < count - 2) items.push("…");
  items.push(count - 1);

  return items;
}

export default DataTable;
