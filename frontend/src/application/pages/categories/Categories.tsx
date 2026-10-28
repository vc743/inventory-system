import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/application/components/ui/button";
import { Skeleton } from "@/application/components/ui/skeleton";
import DataTable from "@/application/components/data-table/DataTable";
import { createCategoryColumns } from "@/application/components/categories/columns";
import CategoryFormDialog from "@/application/components/categories/CategoryFormDialog";
import DeleteCategoryDialog from "@/application/components/categories/DeleteCategoryDialog";
import { getCategories } from "@/infrastructure/api/category/category";
import type { CategoryListItemType } from "@/infrastructure/schemas/category/category";

// Referencia estable: un `[]` nuevo en cada render haría recalcular la tabla.
const EMPTY: CategoryListItemType[] = [];

export const Categories = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryListItemType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<CategoryListItemType | null>(null);

  const columns = useMemo(
    () =>
      createCategoryColumns({
        onEdit: (category) => {
          setEditing(category);
          setFormOpen(true);
        },
        onDelete: (category) => {
          setDeleting(category);
          setDeleteOpen(true);
        },
      }),
    [],
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus productos por tipo.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" />
          Nueva categoría
        </Button>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 max-w-sm" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-12 text-center shadow-card">
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? EMPTY}
          searchPlaceholder="Buscar categoría..."
          emptyMessage="Aún no tienes categorías. Crea la primera."
        />
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
      />
      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deleting}
      />
    </div>
  );
};
