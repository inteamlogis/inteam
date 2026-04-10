import { Package, Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { label: 'Produtos em Estoque', value: '1.248', icon: Package, change: '+12%' },
  { label: 'Colaboradores Ativos', value: '14', icon: Users, change: '+2' },
  { label: 'Pedidos este Mês', value: '87', icon: ShoppingCart, change: '+23%' },
  { label: 'Movimentações', value: '342', icon: TrendingUp, change: '+8%' },
];

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Bom dia, {user?.nome?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aqui está o resumo da sua operação hoje.
        </p>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="card-shadow border-border/50 hover:card-shadow-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{s.value}</p>
                    <p className="text-xs text-success mt-1">{s.change}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAdmin && (
        <Card className="card-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Avisos do Mentor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-foreground font-medium">Novo produto disponível na vitrine</p>
                <p className="text-xs text-muted-foreground mt-1">SKU #4821 — Verificar disponibilidade para sua loja.</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-foreground font-medium">Atualização de preço</p>
                <p className="text-xs text-muted-foreground mt-1">Margens foram recalculadas. Confira o estoque.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['João solicitou 5x SKU #1023', 'Maria devolveu 3x SKU #4821', 'Admin aprovou o cadastro de Pedro'].map(
                (item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{item}</p>
                      <p className="text-[11px] text-muted-foreground">há {i + 1}h</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Dívidas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { from: 'João', to: 'Maria', product: 'SKU #1023', qty: 5, days: 3 },
                { from: 'Pedro', to: 'João', product: 'SKU #8842', qty: 2, days: 7 },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{d.from}</span> → {d.to}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.product} · {d.qty}un</p>
                  </div>
                  <span className="text-xs font-medium text-warning">{d.days} dias</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
