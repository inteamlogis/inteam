import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [form, setForm] = useState({ nome: '', login: '', whatsapp: '', email: '', senha: '', confirmar: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.senha !== form.confirmar) {
      toast({ title: 'Senhas não conferem', variant: 'destructive' });
      return;
    }
    try {
      await register({ nome: form.nome, login: form.login, whatsapp: form.whatsapp, senha: form.senha });
      toast({ title: 'Cadastro enviado!', description: 'Verifique seu e-mail para confirmar a conta. Após confirmação, aguarde a aprovação da diretoria.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">inteam</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie sua conta de colaborador</p>
        </div>

        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-medium text-foreground">Cadastro</h2>
            <p className="text-sm text-muted-foreground">Preencha seus dados para solicitar acesso</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nome Completo</Label>
                <Input value={form.nome} onChange={update('nome')} placeholder="Seu nome" required className="h-10" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Apelido (Login)</Label>
                <Input value={form.login} onChange={update('login')} placeholder="seu.apelido" required className="h-10" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">WhatsApp</Label>
                <Input value={form.whatsapp} onChange={update('whatsapp')} placeholder="11999999999" required className="h-10" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={form.senha}
                    onChange={update('senha')}
                    placeholder="••••••••"
                    required
                    className="h-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmar}
                    onChange={update('confirmar')}
                    placeholder="••••••••"
                    required
                    className="h-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                <UserPlus className="h-4 w-4 mr-2" />
                {isLoading ? 'Enviando...' : 'Solicitar Acesso'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Já tem conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
