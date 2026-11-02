import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/application/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/application/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/application/components/ui/field";
import { Input } from "@/application/components/ui/input";
import {
  createCategory,
  updateCategory,
} from "@/infrastructure/api/category/category";
import {
  categoryFormSchema,
  type CategoryFormType,
  type CategoryListItemType,
} from "@/infrastructure/schemas/category/category";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Si viene una categoría, el diálogo edita; si no, crea. */
  category: CategoryListItemType | null;
}

const CategoryFormDialog = ({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = category !== null;

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "" },
  });

  // Cada vez que se abre, cargar el nombre actual (editar) o vaciar (crear).
  useEffect(() => {
    if (open) form.reset({ name: category?.name ?? "" });
  }, [open, category, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: CategoryFormType) =>
      isEditing
        ? updateCategory({ id: category.id, formData })
        : createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(isEditing ? "Categoría actualizada" : "Categoría creada");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cambia el nombre de la categoría."
              : "Agrupa tus productos con un nombre fácil de reconocer."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="category-form"
          onSubmit={form.handleSubmit((data) => mutate(data))}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category-form-name">Nombre</FieldLabel>
                  <Input
                    {...field}
                    id="category-form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej. Electrónica"
                    autoComplete="off"
                    autoFocus
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button type="submit" form="category-form" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isEditing ? "Guardar cambios" : "Crear categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
