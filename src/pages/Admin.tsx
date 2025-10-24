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
  featured: boolean;
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
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
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

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

      // Upload main image if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      let projectId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update({ ...formData, image_url: imageUrl })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([{ ...formData, image_url: imageUrl }])
          .select()
          .single();

        if (error) throw error;
        projectId = data.id;
      }

      // Upload additional images
      if (additionalImages.length > 0 && projectId) {
        for (let i = 0; i < additionalImages.length; i++) {
          const file = additionalImages[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

          const { error: imageError } = await supabase
            .from('project_images')
            .insert([{
              project_id: projectId,
              image_url: publicUrl,
              display_order: i + 1
            }]);

          if (imageError) throw imageError;
        }
      }

      toast({
        title: editingId ? 'Projeto atualizado!' : 'Projeto criado!',
        description: editingId 
          ? 'As alterações foram salvas com sucesso.' 
          : 'O novo projeto foi adicionado com sucesso.',
      });

      setFormData({ title: '', category: '', description: '', image_url: '', featured: false });
      setImageFile(null);
      setAdditionalImages([]);
      setImagePreview('');
      setAdditionalPreviews([]);
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
      featured: project.featured,
    });
    setImageFile(null);
    setAdditionalImages([]);
    setImagePreview(project.image_url);
    setAdditionalPreviews([]);
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Projeto em Destaque
              </Label>
            </div>

            <div>
              <Label htmlFor="image">
                Imagem Principal {!editingId && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
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
              <Label htmlFor="additional-images">
                Imagens Adicionais (Galeria)
              </Label>
              <Input
                id="additional-images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setAdditionalImages(files);
                  
                  const previews: string[] = [];
                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      previews.push(reader.result as string);
                      if (previews.length === files.length) {
                        setAdditionalPreviews(previews);
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
                className="mt-2"
              />
              {additionalPreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Previews ({additionalPreviews.length} imagens):
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {additionalPreviews.map((preview, idx) => (
                      <img 
                        key={idx}
                        src={preview} 
                        alt={`Preview ${idx + 1}`} 
                        className="w-full h-24 object-cover rounded-lg border border-border"
                      />
                    ))}
                  </div>
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
                    setAdditionalImages([]);
                    setImagePreview('');
                    setAdditionalPreviews([]);
                    setFormData({ title: '', category: '', description: '', image_url: '', featured: false });
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors animate-scale-in"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex-1 flex flex-col">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                      {project.featured && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full font-medium">
                          ⭐ Destaque
                        </span>
                      )}
                    </div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
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
