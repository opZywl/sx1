import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { createAdminUser } from "../../../lib/api/api.js";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/sx1admin/context/AdminAuthProvider";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().min(2).max(50),
});

const AdminSignUp = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setSignUp } = useAdminAuth();
  const { toast } = useToast();

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
      localStorage.setItem("Cookie", data.authToken);
      navigate("/admin");
      form.reset();
      setIsAuthenticated(true);
      setSignUp(false);
      toast({
        title: "Cadastro realizado com sucesso!",
      });
    } else {
      toast({
        title: data.error,
      });
    }
  }

  return (
    <div className=" md:min-h-[80vh] min-h-[75vh] w-[530px] rounded-md flex items-center justify-start flex-col mt-[50px] py-14  max-sm:w-full ">
      <h2 className="text-3xl font-bold  m-5">Cadastro de administrador</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-dark-2 p-7 rounded-md w-[450px] flex flex-col  max-sm:w-[93%] "
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu usuário"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
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
                    placeholder="Digite seu e-mail"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
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
                    placeholder="Digite sua senha"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
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
                        <SelectTrigger className="bg-dark-3 border border-dark-4">
                          <SelectValue placeholder="Escolha o perfil" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem
                          className="bg-zinc-800 text-light-2 focus:bg-zinc-900 focus:text-light-2"
                          value="admin"
                        >
                          Administrador
                        </SelectItem>
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
            className="w-1/4 mx-auto py-2 hover:bg-zinc-700 "
          >
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSignUp;
