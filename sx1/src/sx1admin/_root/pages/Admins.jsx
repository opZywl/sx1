import { getAdmins } from "@/lib/api/api";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalTrigger } from "@/components/ui/animated-modal";
import RegisterAdminModal from "@/sx1admin/components/RegisterAdminModal";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const updateAdmins = async () => {
    const data = await getAdmins();
    const { admins } = data;
    setAdmins(admins);
  };

  useEffect(() => {
    updateAdmins();
  }, []);

  return (
    <div className="bg-transparent absolute inset-0 flex flex-col p-5 max-sm:p-2 min-h-full">
      <div className="flex justify-between items-center ">
        <h2 className="text-5xl m-5 font-bold pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-pink-200 to-dark-4 bg-clip-text leading-none text-transparent max-sm:text-3xl max-sm:text-center">
          Todos os administradores
        </h2>

        <Modal>
          <ModalTrigger className="bg-white text-black px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors">
            Registrar <span className="max-sm:hidden ml-1">novo admin</span>
          </ModalTrigger>
          <ModalBody className="bg-dark-3">
            <RegisterAdminModal onSuccess={updateAdmins} />
          </ModalBody>
        </Modal>
      </div>
      <div className="h-full overflow-auto flex flex-col gap-3 custom-scrollbar">
        {admins.length > 0 &&
          admins.map((admin) => (
            <div
              key={admin._id}
              className="bg-dark-4 rounded-md w-full min-h-[110px] flex justify-start gap-5 px-3 items-center"
            >
              <img src="/icons/account.svg" alt="user" className="h-20" />
              <div className="flex items-center text-2xl lg:text-3xl h-full">
                <h2>{admin.username}</h2>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admins;
