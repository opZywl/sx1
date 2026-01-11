import { formatCurrencyBRL } from "@/lib/utils";

export default function ShippingReturnPolicy() {
  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Política de Envio e Devolução
        </h1>
        <div className="space-y-6 text-gray-300">
          <h2 className="text-xl font-semibold text-white">
            Política de envio
          </h2>
          <p className="text-md">
            Oferecemos frete padrão grátis em pedidos acima de{" "}
            {formatCurrencyBRL(50)}. Para pedidos abaixo de{" "}
            {formatCurrencyBRL(50)}, será cobrada uma taxa fixa de{" "}
            {formatCurrencyBRL(5.99)}. O envio padrão costuma levar de 3 a 5
            dias úteis.
          </p>
          <p className="text-md">
            Opções de envio expresso estão disponíveis no checkout por uma taxa
            adicional. Envio internacional está disponível para países
            selecionados.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Política de devolução
          </h2>
          <p className="text-md">
            Oferecemos uma política de devolução de 30 dias para a maioria dos
            itens. Para ser elegível, o item deve estar sem uso e nas mesmas
            condições em que foi recebido, além de estar na embalagem original.
          </p>
          <p className="text-md">
            Para iniciar uma devolução, entre em contato com o nosso suporte ou
            acesse sua conta para utilizar o portal de devoluções. Assim que sua
            devolução for recebida e inspecionada, enviaremos um e-mail
            confirmando o recebimento e informando a aprovação ou rejeição do
            reembolso.
          </p>
          <p className="text-md">
            Se aprovado, o reembolso será processado e um crédito será aplicado
            automaticamente no método de pagamento original em até 5 a 10 dias
            úteis.
          </p>
          <p className="mt-8 text-sm text-gray-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
