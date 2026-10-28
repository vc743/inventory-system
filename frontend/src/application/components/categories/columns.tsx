import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/application/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/application/components/ui/dropdown-menu";
import { createAppColumnHelper } from "@/application/components/data-table/table-hook";
import type { CategoryListItemType } from "@/infrastructure/schemas/category/category";

interface CategoryColumnActions {
  onEdit: (category: CategoryListItemType) => void;
  onDelete: (category: CategoryListItemType) => void;
}

const columnHelper = createAppColumnHelper<CategoryListItemType>();

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium" });

export const createCategoryColumns = ({
  onEdit,
  onDelete,
}: CategoryColumnActions) =>
  columnHelper.columns([
    columnHelper.accessor("name", {
      header: "Nombre",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("product", {
      header: "Productos",
      enableGlobalFilter: false,
      cell: (info) => (
        <span className="text-muted-foreground tabular-nums">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Creada",
      enableGlobalFilter: false,
      cell: (info) => (
        <span className="text-muted-foreground">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Acciones para ${row.original.name}`}
                />
              }
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Pencil />
                  Editar
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(row.original)}
                >
                  <Trash2 />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ]);
