import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
}

const Projects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Nossos Projetos
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Conheça alguns dos projetos que transformamos em realidade, 
              cada um refletindo a personalidade e necessidades únicas de nossos clientes.
            </p>
          </div>
        </div>
      </section>
      
      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando projetos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum projeto cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project.id}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square shadow-lg">
                    <img 
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-primary-foreground/80 text-sm font-medium mb-2">
                        {project.category}
                      </p>
                      <h3 className="text-2xl font-bold text-primary-foreground mb-3">
                        {project.title}
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                      >
                        {selectedProject === project.id ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                      </Button>
                    </div>
                  </div>
                  
                  {selectedProject === project.id && (
                    <div className="mt-4 p-6 bg-card rounded-lg animate-fade-in">
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Pronto para Começar Seu Projeto?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Entre em contato conosco e vamos transformar suas ideias em realidade.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/contato'}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Fale Conosco
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
