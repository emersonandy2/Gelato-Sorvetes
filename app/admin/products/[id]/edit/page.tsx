"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductByIdAction, updateProductAction, getAllCategoriesAction } from "@/features/admin/actions/admin.actions";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  size: string;
  ingredients: string;
  categoryId: string;
  available: boolean;
  featured: boolean;
  promotion: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>();

  useEffect(() => {
    async function load() {
      const [product, cats] = await Promise.all([
        getProductByIdAction(productId),
        getAllCategoriesAction(),
      ]);

      if (product) {
        reset({
          name: product.name,
          description: product.description || "",
          price: Number(product.price),
          stock: product.stock,
          size: product.size || "",
          ingredients: product.ingredients || "",
          categoryId: product.categoryId,
          available: product.available,
          featured: product.featured,
          promotion: product.promotion,
        });
      }

      setCategories(cats as { id: string; name: string }[]);
      setIsLoading(false);
    }
    load();
  }, [productId, reset]);

  async function onSubmit(data: ProductForm) {
    setIsSubmitting(true);
    try {
      await updateProductAction(productId, {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        size: data.size,
        ingredients: data.ingredients,
        categoryId: data.categoryId,
        available: data.available,
        featured: data.featured,
        promotion: data.promotion,
      });
      toast.success("Produto atualizado com sucesso!");
      router.push("/admin/products");
    } catch {
      toast.error("Erro ao atualizar produto");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Produto</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" {...register("name", { required: "Nome é obrigatório" })} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select
                  value={watch("categoryId")}
                  onValueChange={(value: string | null) => value && setValue("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" {...register("description")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true, required: "Preço é obrigatório" })} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque *</Label>
                <Input id="stock" type="number" {...register("stock", { valueAsNumber: true, required: "Estoque é obrigatório" })} />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Tamanho</Label>
                <Input id="size" {...register("size")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredientes</Label>
              <Textarea id="ingredients" {...register("ingredients")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  checked={watch("available")}
                  onCheckedChange={(checked) => setValue("available", checked)}
                />
                <Label>Disponível</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={watch("featured")}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
                <Label>Destaquue</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={watch("promotion")}
                  onCheckedChange={(checked) => setValue("promotion", checked)}
                />
                <Label>Promoção</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
