import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addVariant } from "@/lib/api/api";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  type: z.string().min(1, {
    message: "O nome deve ter pelo menos 1 caractere.",
  }),
  options: z.string(),
});
const AddVariant = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      options: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values) {
    const a = values.options.split(',').map(item => item.trim())
    values.options = a;
    const data = await addVariant(values);
    if(data.success){
      toast({ title: "Variação adicionada" })
    } else{
      toast({title: data.error})
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  className="bg-dark-3 border border-white/20 h-12 "
                  placeholder="ex: tamanho"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Este é o nome exibido publicamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opções</FormLabel>
              <FormControl>
                <Input
                  className="bg-dark-3 border border-white/20 h-12 "
                  placeholder="ex: 32gb, 64gb"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm">
                Separe cada opção com uma vírgula (,). Exemplo: 32gb, 64gb, ...
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default AddVariant;
