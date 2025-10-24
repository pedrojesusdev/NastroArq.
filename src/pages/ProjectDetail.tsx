import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  image_url: string;
  display_order: number;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);

      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch additional images
      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;
      setImages(imagesData || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar projeto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <p className="text-center text-muted-foreground">Projeto não encontrado</p>
          <div className="text-center mt-6">
            <Link to="/projetos">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Projetos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [{ image_url: project.image_url, display_order: 0 }, ...images];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Link to="/projetos">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Carousel */}
          <div className="animate-fade-in">
            <Carousel className="w-full">
              <CarouselContent>
                {allImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                      <img
                        src={image.image_url}
                        alt={`${project.title} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
            {allImages.length > 1 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {allImages.length} imagens disponíveis
              </p>
            )}
          </div>

          {/* Project Details */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                  ⭐ Destaque
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {project.title}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Interessado em projetos como esse?
              </h3>
              <p className="text-muted-foreground mb-6">
                Entre em contato conosco para discutir como podemos criar algo semelhante para você.
              </p>
              <Link to="/contato">
                <Button size="lg" className="w-full sm:w-auto">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
