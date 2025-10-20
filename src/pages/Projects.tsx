import Navigation from "@/components/Navigation";
import projectBar from "@/assets/project-bar.png";
import projectBedroom from "@/assets/project-bedroom.png";
import projectKitchen from "@/assets/project-kitchen.png";
import projectLiving1 from "@/assets/project-living1.png";
import projectLiving2 from "@/assets/project-living2.png";
import { useState } from "react";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const projects = [
    {
      id: 1,
      title: "Área Gourmet Moderna",
      category: "Residencial",
      image: projectBar,
      description: "Espaço gourmet com design contemporâneo, combinando funcionalidade e conforto para momentos especiais."
    },
    {
      id: 2,
      title: "Suite Master Sofisticada",
      category: "Residencial",
      image: projectBedroom,
      description: "Quarto com design moderno e materiais nobres, criando um ambiente de descanso e elegância."
    },
    {
      id: 3,
      title: "Cozinha Integrada",
      category: "Residencial",
      image: projectKitchen,
      description: "Cozinha contemporânea com madeira natural e iluminação premium, unindo beleza e funcionalidade."
    },
    {
      id: 4,
      title: "Living Minimalista",
      category: "Residencial",
      image: projectLiving1,
      description: "Sala de estar com design clean e linhas modernas, proporcionando amplitude e sofisticação."
    },
    {
      id: 5,
      title: "Sala de Estar Acolhedora",
      category: "Residencial",
      image: projectLiving2,
      description: "Ambiente integrado com madeira e iluminação cênica, criando um espaço acolhedor e elegante."
    }
  ];

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
              Cada projeto é único e desenvolvido com atenção aos detalhes, 
              unindo funcionalidade e estética para criar espaços extraordinários.
            </p>
          </div>
        </div>
      </section>
      
      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="group cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-lg">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-primary-foreground">
                      <p className="text-sm font-medium mb-2">{project.category}</p>
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${selectedProject === project.id ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Quer um Projeto Assim?
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entre em contato e vamos criar juntos o espaço dos seus sonhos
          </p>
          <a href="/contato">
            <button className="bg-card text-foreground hover:bg-card/90 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Iniciar Meu Projeto
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects;
