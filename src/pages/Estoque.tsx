import { useState } from 'react';
import { Search, Eye, EyeOff, Send, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ProdutoEstoque {
  id: string;
  nome_produto: string;
  sku: string;
  quantidade: number;
  margem: number;
  preco_custo: number;
  visivel_equipe: boolean;
  proprietario: string;
}

const MOCK_ESTOQUE: ProdutoEstoque[] = [
  { id: '1', nome_produto: 'Fone Bluetooth TWS Pro', sku: 'FBT-1023', quantidade: 45, margem: 35, preco_custo: 28.5, visivel_equipe: true, proprietario: 'João Silva' },
  { id: '2', nome_produto: 'Carregador Turbo 65W', sku: 'CT-4821', quantidade: 120, margem: 42, preco_custo: 15.0, visivel_equipe: true, proprietario: 'João Silva' },
  { id: '3', nome_produto: 'Película Cerâmica S24', sku: 'PCS-8842', quantidade: 300, margem: 55, preco_custo: 2.8, visivel_equipe: true, proprietario: 'Maria Assistente' },
  { id: '4', nome_produto: 'Capinha MagSafe iPhone 15', sku: 'CMI-2210', quantidade: 80, margem: 48, preco_custo: 12.0, visivel_equipe: false, proprietario: 'João Silva' },
  { id: '5', nome_produto: 'Smartwatch Band Fit', sku: 'SBF-5512', quantidade: 25, margem: 30, preco_custo: 45.0, visivel_equipe: true, proprietario: 'Pedro' },
];

export default function Estoque() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [produtos, setProdutos] = useState(MOCK_ESTOQUE);

  const filtered = produtos.filter((p) => {
    if (!isAdmin && !p.visivel_equipe) return false;
    const q = search.toLowerCase();
    return p.nome_produto.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const toggleVisibility = (id: string) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visivel_equipe: !p.visivel_equipe } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Estoque Colaborativo</h1>
          <p className="text-sm text-muted-foreground mt-1">Vitrine de produtos disponíveis na rede</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="card-shadow border-border/50 hover:card-shadow-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{p.nome_produto}</p>
                    <p className="text-[11px] text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
                {(isAdmin || p.proprietario === 'João Silva') && (
                  <button onClick={() => toggleVisibility(p.id)} className="text-muted-foreground hover:text-foreground">
                    {p.visivel_equipe ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-md bg-muted/50 p-2.5">
                  <p className="text-[11px] text-muted-foreground">Quantidade</p>
                  <p className="text-sm font-semibold text-foreground">{p.quantidade}un</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2.5">
                  <p className="text-[11px] text-muted-foreground">Margem</p>
                  <p className="text-sm font-semibold text-success">{p.margem}%</p>
                </div>
                {isAdmin && (
                  <div className="rounded-md bg-muted/50 p-2.5 col-span-2">
                    <p className="text-[11px] text-muted-foreground">Custo</p>
                    <p className="text-sm font-semibold text-foreground">R$ {p.preco_custo.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {p.proprietario}
                </Badge>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                  <Send className="h-3 w-3" />
                  Solicitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
}
