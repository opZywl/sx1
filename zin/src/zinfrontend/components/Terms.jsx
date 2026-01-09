export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Termos e Condições
        </h1>
        <div className="space-y-3 text-gray-300">
          <p>
            Bem-vindo(a) à sx1 Imports. Ao acessar nosso site e realizar uma
            compra, você concorda com estes Termos e Condições.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Uso do site
          </h2>
          <p>
            Você pode usar nosso site apenas para fins legais. Não é permitido
            utilizar o site de forma que cause, ou possa causar, danos ou
            comprometa a disponibilidade e acessibilidade do site.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Informações de produtos
          </h2>
          <p>
            Buscamos fornecer informações precisas, mas não garantimos que as
            descrições dos produtos ou outros conteúdos sejam exatos, completos,
            confiáveis, atuais ou livres de erros.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Preços e disponibilidade
          </h2>
          <p>
            Todos os preços estão sujeitos a alteração sem aviso prévio.
            Reservamo-nos o direito de modificar ou descontinuar qualquer
            produto sem aviso. Não nos responsabilizamos por qualquer alteração
            de preço, modificação ou descontinuação.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Contas de usuário
          </h2>
          <p>
            Você é responsável por manter a confidencialidade da sua conta e
            senha, bem como por restringir o acesso ao seu computador. Você
            concorda em assumir responsabilidade por todas as atividades
            realizadas com sua conta ou senha.
          </p>
          <p className="mt-8 text-sm text-gray-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
