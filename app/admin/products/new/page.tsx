"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAction, getAllCategoriesAction } from "@/features/admin/actions/admin.actions";
import { slugify } from "@/lib/utils";
import { ImageUpload } from "@/components/products/image-upload";

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

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: {
      available: true,
      featured: false,
      promotion: false,
      stock: 0,
    },
  });

  useEffect(() => {
    async function loadCategories() {
      const cats = await getAllCategoriesAction();
      setCategories(cats as { id: string; name: string }[]);
    }
    loadCategories();
  }, []);

  async function onSubmit(data: ProductForm) {
    setIsSubmitting(true);
    try {
      await createProductAction({
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        price: data.price,
        stock: data.stock,
        size: data.size,
        ingredients: data.ingredients,
        categoryId: data.categoryId,
        available: data.available,
        featured: data.featured,
        promotion: data.promotion,
        images: images.map((url) => ({ url, alt: data.name })),
      });
      toast.success("Produto criado com sucesso!");
      router.push("/admin/products");
    } catch {
      toast.error("Erro ao criar produto");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
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
                <Input id="name" {...register("name", { required: "Nome é obrigatório" })} placeholder="Nome do produto" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select onValueChange={(value: string | null) => value && setValue("categoryId", value)}>
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
              <Textarea id="description" {...register("description")} placeholder="Descrição do produto" />
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
                <Input id="size" {...register("size")} placeholder="Ex: 500ml" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredientes</Label>
              <Textarea id="ingredients" {...register("ingredients")} placeholder="Lista de ingredientes" />
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

        <Card>
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onUpload={(url) => setImages([...images, url])}
              folder="gelato/products"
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((url, index) => (
                  <div key={index} className="relative h-20 rounded overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar Produto
          </Button>
        </div>
      </form>
    </div>
  );
}
