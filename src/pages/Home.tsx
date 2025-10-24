import { useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
}

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setFeaturedProjects(data || []);
    } catch (error) {
      console.error('Erro ao carregar projetos em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Featured Projects Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça alguns dos nossos trabalhos que transformaram espaços em lares
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando projetos...</p>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum projeto em destaque no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {featuredProjects.map((project, index) => (
                <Link 
                  key={project.id}
                  to={`/projeto/${project.id}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-white/90 line-clamp-2">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center animate-fade-in">
            <Link 
              to="/projetos"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-lg transition-all duration-300 group"
            >
              Ver Todos os Projetos 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Pronto para Transformar Seu Espaço?
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entre em contato conosco e descubra como podemos criar o ambiente perfeito para você
          </p>
          <Link to="/contato">
            <button className="bg-card text-foreground hover:bg-card/90 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Fale Conosco
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
