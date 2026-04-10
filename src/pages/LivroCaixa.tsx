import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Divida {
  id: string;
  de: string;
  para: string;
  produto: string;
  sku: string;
  quantidade: number;
  data_retirada: string;
  dias: number;
  quitada: boolean;
}

const MOCK_DIVIDAS: Divida[] = [
  { id: '1', de: 'João Silva', para: 'Maria Santos', produto: 'Fone Bluetooth TWS Pro', sku: 'FBT-1023', quantidade: 5, data_retirada: '2025-04-05', dias: 5, quitada: false },
  { id: '2', de: 'Pedro Oliveira', para: 'João Silva', produto: 'Película Cerâmica S24', sku: 'PCS-8842', quantidade: 10, data_retirada: '2025-04-02', dias: 8, quitada: false },
  { id: '3', de: 'Ana Costa', para: 'Pedro Oliveira', produto: 'Carregador Turbo 65W', sku: 'CT-4821', quantidade: 3, data_retirada: '2025-03-28', dias: 0, quitada: true },
];

export default function LivroCaixa() {
  const ativas = MOCK_DIVIDAS.filter((d) => !d.quitada);
  const quitadas = MOCK_DIVIDAS.filter((d) => d.quitada);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Livro-Caixa de Dívidas</h1>
        <p className="text-sm text-muted-foreground mt-1">Controle de empréstimos entre parceiros</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-shadow border-border/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Dívidas Ativas</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{ativas.length}</p>
          </CardContent>
        </Card>
        <Card className="card-shadow border-border/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Itens Pendentes</p>
            <p className="text-2xl font-semibold text-warning mt-1">{ativas.reduce((a, d) => a + d.quantidade, 0)}un</p>
          </CardContent>
        </Card>
        <Card className="card-shadow border-border/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Quitadas</p>
            <p className="text-2xl font-semibold text-success mt-1">{quitadas.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            Dívidas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ativas.map((d) => (
              <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border/50 p-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{d.de}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{d.para}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-foreground">{d.produto}</p>
                    <p className="text-[11px] text-muted-foreground">{d.sku} · {d.quantidade}un · {d.dias} dias</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Dar Baixa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {quitadas.length > 0 && (
        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Histórico Quitado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quitadas.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg p-4 opacity-60">
                <div className="flex items-center gap-2 text-sm">
                  <span>{d.de}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>{d.para}</span>
                </div>
                <Badge variant="secondary" className="text-[11px]">{d.produto} · {d.quantidade}un</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
