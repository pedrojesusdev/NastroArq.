import Navigation from "@/components/Navigation";
import architect1 from "@/assets/architect-1.jpg";
import architect2 from "@/assets/architect-2.jpg";
import { Instagram } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Ana Paula Silva",
      role: "CEO e Arquiteta",
      image: architect1,
      instagram: "_anapaula_arquitetura",
      description: "Especialista em design de interiores com mais de 10 anos de experiência em projetos residenciais de alto padrão."
    },
    {
      name: "Carlos Eduardo",
      role: "CEO e Arquiteto",
      image: architect2,
      instagram: "carloseduardo.arq",
      description: "Focado em arquitetura sustentável e otimização de espaços, trazendo inovação e funcionalidade para cada projeto."
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
              Sobre Nós
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Somos uma equipe apaixonada por criar espaços que refletem a personalidade 
              e necessidades de cada cliente, unindo funcionalidade e beleza em cada projeto.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Nossa Missão
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Transformar espaços em lares acolhedores e funcionais, onde cada detalhe 
              é pensado para proporcionar conforto, beleza e qualidade de vida. 
              Acreditamos que bons projetos nascem da escuta atenta e do entendimento 
              profundo das necessidades de quem vai viver o espaço.
            </p>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Conheça os Responsáveis por Realizar o Seu Sonho
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 shadow-lg">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {member.description}
                  </p>
                  <a 
                    href={`https://www.instagram.com/${member.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>@{member.instagram}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
