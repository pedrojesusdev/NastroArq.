import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Trash2, Edit2, Plus, LogOut } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchProjects();
    }
  }, [user, isAdmin]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar projetos',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Projeto atualizado!',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: 'Projeto criado!',
          description: 'O novo projeto foi adicionado com sucesso.',
        });
      }

      setFormData({ title: '', category: '', description: '', image_url: '' });
      setEditingId(null);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar projeto',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image_url: project.image_url,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Projeto excluído!',
        description: 'O projeto foi removido com sucesso.',
      });

      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir projeto',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-lg text-muted-foreground">
              Bem-vindo ao painel de gerenciamento
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {editingId ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="mt-2"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg">
                {editingId ? 'Salvar Alterações' : 'Adicionar Projeto'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', category: '', description: '', image_url: '' });
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Google Sheets */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Planilha de Contatos
          </h2>
          <p className="text-muted-foreground mb-4">
            Visualize os contatos recebidos através do formulário. Para editar, clique no link abaixo da planilha.
          </p>
          <div className="w-full rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://docs.google.com/spreadsheets/d/178w-JxHgrEscy152xACejKjAk7WWhIU4QCLxjQafiuw/preview?gid=0"
              className="w-full h-[600px] border-0"
              title="Planilha de Contatos"
            />
          </div>
          <div className="mt-4 text-center">
            <a 
              href="https://docs.google.com/spreadsheets/d/178w-JxHgrEscy152xACejKjAk7WWhIU4QCLxjQafiuw/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm underline"
            >
              Abrir planilha em nova aba para editar
            </a>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Projetos Adicionados pelo Administrador
          </h2>
          <p className="text-muted-foreground mb-6">
            Aqui você pode adicionar novos projetos que aparecerão na página de projetos junto com os projetos padrão.
          </p>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 bg-background rounded-lg"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum projeto cadastrado ainda.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
