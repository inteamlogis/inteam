import { Settings, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Configurações Avançadas</h1>
        <p className="text-sm text-muted-foreground mt-1">Preferências globais do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Visibilidade de Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Ocultar preço de custo para colaboradores</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Exigir aprovação para ver margens</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Permitir auto-cadastro de estoque</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Notificar novas solicitações de estoque</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Alerta de dívidas acima de 7 dias</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Resumo diário por WhatsApp</Label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Permitir registro de novos colaboradores</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Modo de manutenção</Label>
              <Switch />
            </div>
            <Button className="h-9 text-sm gap-1">
              <Save className="h-4 w-4" /> Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
