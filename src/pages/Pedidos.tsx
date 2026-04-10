import { useState } from 'react';
import { Plus, MessageSquare, X, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface Pedido {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  criador: string;
  designado: string;
  mensagens: { autor: string; texto: string; hora: string }[];
}

const MOCK_PEDIDOS: Pedido[] = [
  {
    id: '1', titulo: 'Verificar estoque SKU #1023', descricao: 'Preciso de um levantamento atualizado', status: 'pendente',
    criador: 'Admin', designado: 'João',
    mensagens: [{ autor: 'Admin', texto: 'João, pode verificar se esse SKU ainda tem no depósito?', hora: '09:30' }],
  },
  {
    id: '2', titulo: 'Solicitar reposição ML', descricao: 'Lote acabou na shopee', status: 'em_andamento',
    criador: 'João', designado: 'Admin',
    mensagens: [{ autor: 'João', texto: 'Precisamos de mais unidades pro ML, acabou na Shopee.', hora: '10:15' }],
  },
  {
    id: '3', titulo: 'Cadastrar novo produto', descricao: 'Película iPhone 16 chegou', status: 'concluido',
    criador: 'Admin', designado: 'Maria',
    mensagens: [],
  },
];

const COLUNAS = [
  { key: 'pendente' as const, label: 'Pendente', color: 'bg-warning/10 text-warning' },
  { key: 'em_andamento' as const, label: 'Em Andamento', color: 'bg-primary/10 text-primary' },
  { key: 'concluido' as const, label: 'Concluído', color: 'bg-success/10 text-success' },
];

export default function Pedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [newMsg, setNewMsg] = useState('');

  const sendMessage = () => {
    if (!newMsg.trim() || !selectedPedido) return;
    const msg = { autor: user?.nome || '', texto: newMsg, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setPedidos((prev) =>
      prev.map((p) => (p.id === selectedPedido.id ? { ...p, mensagens: [...p.mensagens, msg] } : p))
    );
    setSelectedPedido((prev) => prev ? { ...prev, mensagens: [...prev.mensagens, msg] } : null);
    setNewMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Board de Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-1">Kanban bidirecional de demandas</p>
        </div>
        <Button className="h-9 text-sm gap-1">
          <Plus className="h-4 w-4" /> Novo Pedido
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {COLUNAS.map((col) => (
          <div key={col.key} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-[11px] ${col.color}`}>
                {col.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {pedidos.filter((p) => p.status === col.key).length}
              </span>
            </div>
            {pedidos
              .filter((p) => p.status === col.key)
              .map((p) => (
                <Card
                  key={p.id}
                  className="card-shadow border-border/50 cursor-pointer hover:card-shadow-hover transition-shadow"
                  onClick={() => setSelectedPedido(p)}
                >
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-foreground">{p.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.descricao}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>{p.criador}</span>
                        <span>→</span>
                        <span>{p.designado}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {p.mensagens.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPedido} onOpenChange={() => setSelectedPedido(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">{selectedPedido?.titulo}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedPedido?.descricao}</p>
          <div className="border-t border-border pt-3 mt-2">
            <p className="text-xs font-medium text-muted-foreground mb-3">Chat do Pedido</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedPedido?.mensagens.map((m, i) => (
                <div key={i} className={`rounded-lg p-3 ${m.autor === user?.nome ? 'bg-primary/10 ml-8' : 'bg-muted/50 mr-8'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-foreground">{m.autor}</span>
                    <span className="text-[10px] text-muted-foreground">{m.hora}</span>
                  </div>
                  <p className="text-sm text-foreground">{m.texto}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Escrever mensagem..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="h-9"
              />
              <Button size="sm" className="h-9 px-3" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
