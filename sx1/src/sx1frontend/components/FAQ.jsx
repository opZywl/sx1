import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "Aceitamos os principais cartões de crédito (Visa, MasterCard e American Express), PayPal e Apple Pay. Em algumas regiões, também oferecemos opções como Klarna e Afterpay."
  },
  {
    question: "Quanto tempo leva o envio?",
    answer:
      "Os prazos variam conforme sua localização e o método de envio escolhido. Em geral, pedidos nacionais são entregues em 3 a 5 dias úteis, enquanto pedidos internacionais podem levar de 7 a 14 dias úteis. Opções expressas ficam disponíveis no checkout."
  },
  {
    question: "Qual é a política de devolução?",
    answer:
      "Oferecemos devolução em até 30 dias para a maioria dos itens. Os produtos devem estar sem uso e na embalagem original. Para iniciar a devolução, acesse sua conta e siga as instruções ou fale com nosso suporte."
  },
  {
    question: "Vocês fazem envio internacional?",
    answer:
      "Sim, enviamos para a maioria dos países. Os custos e prazos variam conforme o destino. Você verá o valor do frete e o prazo estimado no checkout após informar seu endereço."
  },
  {
    question: "Como posso acompanhar meu pedido?",
    answer:
      "Quando seu pedido for enviado, você receberá um e-mail com o código de rastreio. Com ele, você pode acompanhar o pacote em nosso site ou no site da transportadora. Também é possível ver o status do pedido ao entrar na sua conta."
  },
  {
    question: "Os produtos são originais?",
    answer:
      "Sim. Vendemos apenas produtos 100% originais, adquiridos diretamente das marcas ou distribuidores autorizados. Levamos a autenticidade muito a sério e seguimos processos rigorosos para garantir a procedência."
  },
  {
    question: "Vocês oferecem embalagem para presente?",
    answer:
      "Sim, oferecemos embalagem para presente por uma pequena taxa adicional. Você pode selecionar essa opção no checkout. Nós embalamos o item com cuidado e podemos incluir um cartão com mensagem personalizada mediante solicitação."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          Perguntas frequentes
        </h1>
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-dark-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left py-4 focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-md font-medium">{faq.question}</h2>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="pb-4 text-sm text-gray-400">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
