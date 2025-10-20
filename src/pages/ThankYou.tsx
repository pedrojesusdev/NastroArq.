import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Obrigado por Entrar em Contato!
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Recebemos sua mensagem e estamos ansiosos para conhecer mais sobre seu projeto. 
              Nossa equipe entrará em contato em breve para discutir como podemos transformar 
              seus sonhos em realidade.
            </p>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                O Que Acontece Agora?
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Análise da Solicitação</h3>
                    <p className="text-muted-foreground">
                      Analisaremos sua mensagem e entenderemos suas necessidades
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Primeiro Contato</h3>
                    <p className="text-muted-foreground">
                      Entraremos em contato em até 24 horas úteis
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Reunião Inicial</h3>
                    <p className="text-muted-foreground">
                      Agendaremos uma reunião para discutir seu projeto em detalhes
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  Voltar ao Início
                </Button>
              </Link>
              
              <Link to="/projetos">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-medium"
                >
                  Ver Nossos Projetos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThankYou;
