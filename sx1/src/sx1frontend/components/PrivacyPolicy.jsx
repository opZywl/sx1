export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-center mb-8">
          Política de Privacidade
        </h1>
        <div className="text-gray-300">
          <p className="text-md">
            Na sx1 Imports, temos o compromisso de proteger a sua privacidade.
            Esta Política de Privacidade explica como coletamos, usamos e
            protegemos suas informações pessoais.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Informações que coletamos
          </h2>
          <p className="text-md">
            Coletamos informações que você fornece diretamente, como quando cria
            uma conta, faz uma compra ou entra em contato com nosso suporte.
            Isso pode incluir seu nome, e-mail, endereço, telefone e dados de
            pagamento.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Como usamos suas informações
          </h2>
          <p className="text-md">
            Usamos suas informações para processar pedidos, oferecer suporte,
            enviar comunicações promocionais (quando autorizado) e melhorar
            nossos serviços.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Segurança dos dados
          </h2>
          <p className="text-md">
            Adotamos diversas medidas de segurança para manter suas informações
            protegidas. No entanto, nenhum método de transmissão pela Internet
            ou armazenamento eletrônico é 100% seguro.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Seus direitos
          </h2>
          <p className="text-md">
            Você tem o direito de acessar, corrigir ou excluir seus dados
            pessoais. Também pode se opor ou restringir certos tratamentos. Para
            exercer esses direitos, entre em contato conosco.
          </p>
          <p className="mt-8 text-sm text-gray-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
