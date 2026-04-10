import { Plus, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Marketplace {
  id: string;
  nome: string;
  plataforma: string;
  api_status: 'conectado' | 'desconectado';
}

const MOCK_MKT: Marketplace[] = [
  { id: '1', nome: 'Loja Principal ML', plataforma: 'Mercado Livre', api_status: 'conectado' },
  { id: '2', nome: 'Acessórios Tech', plataforma: 'Shopee', api_status: 'conectado' },
  { id: '3', nome: 'Casa Fit Store', plataforma: 'Mercado Livre', api_status: 'desconectado' },
];

export default function Marketplaces() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Marketplaces</h1>
          <p className="text-sm text-muted-foreground mt-1">Suas lojas e conexões com plataformas</p>
        </div>
        <Button className="h-9 text-sm gap-1">
          <Plus className="h-4 w-4" /> Adicionar Loja
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_MKT.map((m) => (
          <Card key={m.id} className="card-shadow border-border/50 hover:card-shadow-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.nome}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.plataforma}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[11px] gap-1 ${
                    m.api_status === 'conectado' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {m.api_status === 'conectado' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {m.api_status === 'conectado' ? 'Conectado' : 'Offline'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1">
                <ExternalLink className="h-3 w-3" /> Gerenciar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
