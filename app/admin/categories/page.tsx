"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageUpload } from "@/components/products/image-upload";
import { getAllCategoriesAction, createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/features/admin/actions/admin.actions";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

const ICON_OPTIONS = [
  { value: "", label: "Nenhum" },
  { value: "🍨", label: "Sorvete" },
  { value: "🍦", label: "Cone" },
  { value: "🍇", label: "Açaí" },
  { value: "🥤", label: "Milkshake" },
  { value: "🎉", label: "Combo" },
  { value: "🍫", label: "Chocolate" },
  { value: "🍰", label: "Bolo" },
  { value: "🧃", label: "Bebida" },
  { value: "🧊", label: "Picolé" },
  { value: "🧁", label: "Cupcake" },
  { value: "🍮", label: "Pudim" },
  { value: "🍡", label: "Dango" },
  { value: "🍪", label: "Biscoito" },
  { value: "🎂", label: "Aniversário" },
  { value: "⭐", label: "Destaque" },
  { value: "🔥", label: "Popular" },
  { value: "❄️", label: "Frio" },
  { value: "🌴", label: "Tropical" },
  { value: "🍬", label: "Doce" },
  { value: "☕", label: "Café" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string; icon?: string | null; image?: string | null; _count: { products: number } }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; icon?: string | null; image?: string | null } | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    const data = await getAllCategoriesAction();
    setCategories(data as typeof categories);
    setIsLoading(false);
  }

  async function handleSave() {
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await updateCategoryAction(editingCategory.id, {
          name: categoryName,
          icon: categoryIcon,
          image: categoryImage || undefined,
        });
        toast.success("Categoria atualizada!");
      } else {
        await createCategoryAction({
          name: categoryName,
          slug: slugify(categoryName),
          icon: categoryIcon,
          image: categoryImage || undefined,
        });
        toast.success("Categoria criada!");
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setCategoryName("");
      setCategoryIcon("");
      setCategoryImage("");
      loadCategories();
    } catch {
      toast.error("Erro ao salvar categoria");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategoryAction(id);
      toast.success("Categoria excluída!");
      loadCategories();
    } catch {
      toast.error("Erro ao excluir categoria");
    }
  }

  function openEdit(category: { id: string; name: string; icon?: string | null; image?: string | null }) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryIcon(category.icon || "");
    setCategoryImage(category.image || "");
    setIsDialogOpen(true);
  }

  function openNew() {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryIcon("");
    setCategoryImage("");
    setIsDialogOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ícone</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-2xl">{category.icon || "—"}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell>{category._count.products}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" />}>
                            <Trash2 className="h-4 w-4" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nome da categoria"
              />
            </div>

            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="grid grid-cols-10 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon.value || "none"}
                    type="button"
                    onClick={() => setCategoryIcon(icon.value)}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                      categoryIcon === icon.value
                        ? "border-primary bg-primary/10 scale-110"
                        : "border-border hover:border-primary/50"
                    }`}
                    title={icon.label}
                  >
                    {icon.value || "—"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Ícone selecionado: <span className="text-lg">{categoryIcon || "Nenhum"}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Imagem da Categoria (opcional)</Label>
              <ImageUpload
                onUpload={(url) => setCategoryImage(url)}
                currentImage={categoryImage || undefined}
                folder="gelato/categories"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
