"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  folder?: string;
  disabled?: boolean;
}

export function ImageUpload({ onUpload, currentImage, folder = "gelato", disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo: 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.data.url);
        onUpload(result.data.url);
        toast.success("Imagem enviada com sucesso!");
      } else {
        toast.error(result.message || "Erro ao enviar imagem");
      }
    } catch {
      toast.error("Erro ao enviar imagem");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-32 border-dashed"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          type="button"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
          ) : (
            <ImageIcon className="h-6 w-6 mr-2" />
          )}
          {isUploading ? "Enviando..." : "Clique para enviar imagem"}
        </Button>
      )}
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
