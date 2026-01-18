import { ModalContent, useModal } from "@/components/ui/animated-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdminUser } from "@/lib/api/api";
import { useToast } from "@/components/ui/use-toast";
import PropTypes from "prop-types";

const formSchema = z.object({
  username: z.string().min(3, { message: "Usuário deve ter pelo menos 3 caracteres" }).max(50),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  role: z.string().min(2, { message: "Selecione um perfil" }).max(50),
});

const RegisterAdminModal = ({ onSuccess }) => {
  const { toast } = useToast();
  const { setOpen } = useModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(values) {
    const data = await createAdminUser(values);
    if (data.success) {
      toast({
        title: "Administrador cadastrado com sucesso!",
      });
      form.reset();
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      toast({
        title: data.error || "Erro ao cadastrar administrador",
      });
    }
  }

  return (
    <ModalContent className="overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar novo administrador</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-dark-3 p-5 rounded-xl w-full mx-auto flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome de usuário"
                    className="bg-dark-4 text-light-2 border border-dark-4 h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o e-mail"
                    type="email"
                    className="bg-dark-4 text-light-2 border border-dark-4 h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a senha"
                    type="password"
                    className="bg-dark-4 text-light-2 border border-dark-4 h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={() => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <FormControl>
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-dark-4 border border-dark-4 h-12">
                          <SelectValue placeholder="Escolha o perfil" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-4 text-white border-none z-[199]">
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full py-3 mt-2 hover:bg-zinc-700"
          >
            Cadastrar
          </Button>
        </form>
      </Form>
    </ModalContent>
  );
};

RegisterAdminModal.propTypes = {
  onSuccess: PropTypes.func,
};

export default RegisterAdminModal;
