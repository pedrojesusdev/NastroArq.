import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verificar se é o email do admin
    if (email !== 'nastro.arquitetura@gmail.com') {
      toast({
        title: 'Acesso negado',
        description: 'Este email não tem permissão de administrador.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      // Tentar fazer login
      const { error: loginError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        // Se o usuário não existe, criar conta
        if (loginError.message.includes('Invalid login credentials')) {
          const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signupError) throw signupError;

          // Fazer login após criar conta
          const { error: newLoginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (newLoginError) throw newLoginError;

          // Adicionar role de admin
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('user_roles').insert({
              user_id: user.id,
              role: 'admin'
            });
          }

          toast({
            title: 'Conta criada!',
            description: 'Login realizado com sucesso.',
          });
        } else {
          throw loginError;
        }
      } else {
        // Login bem-sucedido
        toast({
          title: 'Login bem-sucedido!',
          description: 'Você será redirecionado...',
        });
      }

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.message || 'Verifique suas credenciais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
              Área do Administrador
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Apenas o administrador autorizado pode acessar esta área.
            </p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
