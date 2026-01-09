import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark-6 border-t sm:px-8 border-dark-4 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
            <img src="/icons/navbar.svg" className="w-11" />
              <span className="font-bold text-lg">sx1 Imports</span>
            </Link>
          </div>
          <nav className="flex flex-col space-y-2 text-zinc-400 text-sm">
            <Link to="/" className="hover:underline">
              Início
            </Link>
            <Link to="/about" className="hover:underline">
              Sobre
            </Link>
            <Link to="/terms" className="hover:underline">
              Termos e Condições
            </Link>
            <Link to="/shipping" className="hover:underline">
              Envio e Devolução
            </Link>
            <Link to="/privacy" className="hover:underline">
              Política de Privacidade
            </Link>
            <Link to="/faq" className="hover:underline">
              Perguntas frequentes
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © 2023-2026 sx1 Imports, Inc. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
