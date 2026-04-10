import { useState } from 'react';
import { Check, X, RefreshCw, Shield, User, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Membro {
  id: string;
  nome: string;
  login: string;
  role: string;
  ativo: boolean;
  whatsapp: string;
}

const MOCK_EQUIPE: Membro[] = [
  { id: '2', nome: 'João Silva', login: 'joao', role: 'colaborador', ativo: true, whatsapp: '11988888888' },
  { id: '3', nome: 'Maria Santos', login: 'maria', role: 'assistente', ativo: true, whatsapp: '11977777777' },
  { id: '4', nome: 'Pedro Oliveira', login: 'pedro', role: 'colaborador', ativo: false, whatsapp: '11966666666' },
  { id: '5', nome: 'Ana Costa', login: 'ana', role: 'colaborador', ativo: false, whatsapp: '11955555555' },
];

export default function Equipe() {
  const [membros, setMembros] = useState(MOCK_EQUIPE);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const pendentes = membros.filter((m) => !m.ativo);
  const ativos = membros.filter((m) => m.ativo);

  const toggleAtivo = (id: string) => {
    setMembros((prev) => prev.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m)));
    toast({ title: 'Status atualizado' });
  };

  const filtered = (list: Membro[]) =>
    list.filter((m) => {
      const q = search.toLowerCase();
      return m.nome.toLowerCase().includes(q) || m.login.toLowerCase().includes(q);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Gestão de Equipe</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie colaboradores e permissões</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar membro..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" title="Hot Reload">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {pendentes.length > 0 && (
        <Card className="card-shadow border-warning/20 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" />
              Aprovações Pendentes ({pendentes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filtered(pendentes).map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg bg-card p-4 card-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.nome}</p>
                      <p className="text-[11px] text-muted-foreground">@{m.login} · {m.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={() => toggleAtivo(m.id)}>
                      <Check className="h-3 w-3" /> Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-destructive hover:text-destructive">
                      <X className="h-3 w-3" /> Recusar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-shadow border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Membros Ativos ({ativos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered(ativos).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                    {m.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.nome}</p>
                    <p className="text-[11px] text-muted-foreground">@{m.login} · {m.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[11px] capitalize">{m.role}</Badge>
                  <Switch checked={m.ativo} onCheckedChange={() => toggleAtivo(m.id)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
