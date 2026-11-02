import { Pencil, Trash2 } from "lucide-react";
import ActionButton from "@/application/components/data-table/ActionButton";
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
      header: "Fecha de creación",
      enableGlobalFilter: false,
      cell: (info) => (
        <span className="text-muted-foreground">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <ActionButton
            label="Editar"
            ariaLabel={`Editar ${row.original.name}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </ActionButton>
          <ActionButton
            label="Eliminar"
            ariaLabel={`Eliminar ${row.original.name}`}
            onClick={() => onDelete(row.original)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
          </ActionButton>
        </div>
      ),
    }),
  ]);
