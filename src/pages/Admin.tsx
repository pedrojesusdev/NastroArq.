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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

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
    
    // Validação: imagem é obrigatória para novos projetos
    if (!editingId && !imageFile) {
      toast({
        title: 'Imagem obrigatória',
        description: 'Por favor, selecione uma imagem para o projeto.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update({ ...formData, image_url: imageUrl })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Projeto atualizado!',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{ ...formData, image_url: imageUrl }]);

        if (error) throw error;

        toast({
          title: 'Projeto criado!',
          description: 'O novo projeto foi adicionado com sucesso.',
        });
      }

      setFormData({ title: '', category: '', description: '', image_url: '' });
      setImageFile(null);
      setImagePreview('');
      setEditingId(null);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar projeto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
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
    setImageFile(null);
    setImagePreview(project.image_url);
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
              <Label htmlFor="image">
                Imagem do Projeto {!editingId && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    // Criar preview da imagem
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="mt-2"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
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
              <Button type="submit" size="lg" disabled={uploading} className="min-w-[200px]">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Salvando...
                  </span>
                ) : (
                  <>
                    {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {editingId ? 'Salvar Alterações' : 'Adicionar Projeto'}
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setEditingId(null);
                    setImageFile(null);
                    setImagePreview('');
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Projetos Cadastrados
              </h2>
              <p className="text-muted-foreground">
                Total: {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col md:flex-row gap-6 p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                    <p className="text-sm text-primary font-medium">{project.category}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="flex md:flex-col gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 md:flex-none"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Nenhum projeto cadastrado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Adicione seu primeiro projeto usando o formulário acima
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
