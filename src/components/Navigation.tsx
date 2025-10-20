import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/sobre", label: "Sobre" },
    { path: "/projetos", label: "Projetos" },
    { path: "/contato", label: "Contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-foreground hover:opacity-90 transition-opacity"
          >
            <img src={logo} alt="Coliseu Arquitetura" className="h-10 w-auto" />
            <span className="font-semibold text-lg hidden sm:inline">Coliseu Arquitetura</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm sm:text-base font-medium px-3 py-2 rounded-lg transition-all duration-300",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:text-primary hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
