"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreSettingsAction, updateStoreSettingsAction } from "@/features/admin/actions/admin.actions";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getStoreSettingsAction();
      setSettings(data);
      setIsLoading(false);
    }
    load();
  }, []);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateStoreSettingsAction(settings);
      toast.success("Configurações salvas!");
    } catch {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Loja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Loja</Label>
                <Input
                  value={settings.store_name || ""}
                  onChange={(e) => handleChange("store_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={settings.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={settings.whatsapp || ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="558896357773"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={settings.instagram || ""}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={settings.facebook || ""}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pedido Mínimo (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.minimum_order || ""}
                  onChange={(e) => handleChange("minimum_order", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa de Entrega Padrão (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.delivery_fee || ""}
                  onChange={(e) => handleChange("delivery_fee", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link do Google Maps</Label>
              <Input
                value={settings.google_maps_link || ""}
                onChange={(e) => handleChange("google_maps_link", e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagem WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Template da Mensagem</Label>
              <Textarea
                rows={10}
                value={settings.whatsapp_message_template || ""}
                onChange={(e) => handleChange("whatsapp_message_template", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Variáveis disponíveis: {"{name}"}, {"{phone}"}, {"{address}"}, {"{payment}"}, {"{items}"}, {"{notes}"}, {"{total}"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
