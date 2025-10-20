import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const Home = () => {
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
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-scale-in">
              <img 
                src={project1} 
                alt="Projeto de cozinha moderna"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <img 
                src={project2} 
                alt="Projeto de quarto contemporâneo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          
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
