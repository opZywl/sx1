import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";

const SizeGuideModal = () => {
  return (
    <Modal>
      <ModalTrigger className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2">
        Qual é o meu tamanho?
      </ModalTrigger>
      <ModalBody>
        <ModalContent className="text-dark-1">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Guia de tamanhos</h2>
              <p className="text-sm text-zinc-500">
                Compare suas medidas com a tabela abaixo para encontrar o ajuste
                ideal.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left bg-zinc-100">
                    <th className="p-3 font-semibold">BR</th>
                    <th className="p-3 font-semibold">Busto (cm)</th>
                    <th className="p-3 font-semibold">Cintura (cm)</th>
                    <th className="p-3 font-semibold">Quadril (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "P", bust: "84-88", waist: "68-72", hip: "92-96" },
                    { size: "M", bust: "88-92", waist: "72-76", hip: "96-100" },
                    { size: "G", bust: "92-96", waist: "76-80", hip: "100-104" },
                    { size: "GG", bust: "96-102", waist: "80-86", hip: "104-110" },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-zinc-200">
                      <td className="p-3 font-semibold">{row.size}</td>
                      <td className="p-3">{row.bust}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-zinc-500">
              Medidas aproximadas para referência. Ajuste conforme o caimento
              desejado.
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button className="bg-blue-700 text-white hover:bg-blue-600">
            Entendi
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default SizeGuideModal;
