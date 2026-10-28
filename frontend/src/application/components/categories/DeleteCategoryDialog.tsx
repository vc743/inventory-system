import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/application/components/ui/alert-dialog";
import { deleteCategory } from "@/infrastructure/api/category/category";
import type { CategoryListItemType } from "@/infrastructure/schemas/category/category";

interface DeleteCategoryDialogProps {
  open: boolean;
  category: CategoryListItemType | null;
  onOpenChange: (open: boolean) => void;
}

const DeleteCategoryDialog = ({
  open,
  category,
  onOpenChange,
}: DeleteCategoryDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Ya sabemos el conteo por la lista: avisamos antes de que el backend lo rechace.
  const productCount = category?.product ?? 0;
  const hasProducts = productCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasProducts
              ? "No se puede eliminar"
              : `¿Eliminar "${category?.name}"?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasProducts
              ? `Esta categoría tiene ${productCount} ${productCount === 1 ? "producto" : "productos"}. Muévelos a otra categoría antes de eliminarla.`
              : "Esta acción no se puede deshacer."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {hasProducts ? "Entendido" : "Cancelar"}
          </AlertDialogCancel>
          {!hasProducts && (
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={() => category && mutate(category.id)}
            >
              {isPending && <Loader2 className="animate-spin" />}
              Eliminar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
