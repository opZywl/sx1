import { ModalContent, useModal } from "@/components/ui/animated-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { getVariations, updateProduct } from "../../lib/api/api.js";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z
      .string()
      .min(1, { message: "O nome deve ter pelo menos 1 caractere" })
      .max(70, { message: "O nome deve ter no máximo 70 caracteres" }),
  description: z
      .string()
      .min(1, { message: "A descrição deve ter pelo menos 1 caractere" })
      .max(100, { message: "A descrição deve ter no máximo 100 caracteres" }),
  price: z
      .string()
      .min(1, { message: "Informe o preço" }),
  category: z
      .string()
      .min(1, { message: "A categoria deve ser informada" }),
  stock: z
      .string()
      .min(1, { message: "Informe o estoque" }),
  imageUrl: z.string().optional(),
});

const UpdateModal = ({ product, refreshProducts }) => {
  const { toast } = useToast();
  const { setOpen } = useModal();
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [uploadedImageUrl, setUploadedImageUrl] = useState(product.imageUrl); // State to hold either original or uploaded image URL
  const [isUploading, setIsUploading] = useState(false); // Loading state for image upload
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Cleanup blob URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Set initial options for variations
  useEffect(() => {
    if (product.variations) {
      const variationTypes = product.variations.map(
          (variation) => variation.type
      );
      setSelectedOptions(variationTypes);
    }
  }, [product]);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await getVariations(); // Fetch options for variations
        setOptions(response.variations);
      } catch (error) {
        console.error("Error fetching variations:", error);
      }
    };

    fetchVariations();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      price: product.price ? product.price.toString() : "",
      category: product.category || "",
      stock: product.stock ? product.stock.toString() : "",
      imageUrl: product.imageUrl || "",
      variations: selectedOptions || [],
    },
  });

  // Submit handler
  async function onSubmit(values) {
    const finalImageUrl = uploadedImageUrl || product.imageUrl;

    // Validate that we have a proper URL (not a blob URL)
    if (!finalImageUrl) {
      toast({ title: "Adicione uma imagem antes de salvar o produto." });
      return;
    }

    // Ensure the URL is a valid cloud URL, not a temporary blob URL
    if (finalImageUrl.startsWith("blob:")) {
      toast({ title: "Aguarde o upload da imagem terminar." });
      return;
    }

    const body = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      category: values.category,
      stock: parseInt(values.stock, 10),
      variations: selectedOptions,
      imageUrl: finalImageUrl, // Use the Cloudinary URL (permanent)
    };

    try {
      const update = await updateProduct(product._id, body);
      if (update.success) {
        toast({ title: "Produto atualizado com sucesso" });
        setOpen(false);
        refreshProducts();
      } else {
        toast({ title: "Falha ao atualizar o produto" });
      }
    } catch (error) {
      console.log(error.message)
      toast({
        title: "Erro ao atualizar o produto",
        description: error.message,
      });
    }
  }

  // Handle file drop and upload image
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    // Revoke old blob URL if exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Set preview and start upload
    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/admin/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Falha ao enviar a imagem");
      }

      const data = await response.json();

      // Validate that we got a proper Cloudinary URL
      if (!data.filepath || !data.filepath.startsWith("https://")) {
        throw new Error("URL de imagem inválida retornada pelo servidor");
      }

      // Use the Cloudinary URL - this is permanent and won't disappear
      setUploadedImageUrl(data.filepath);
      form.setValue("imageUrl", data.filepath, { shouldValidate: true });
      toast({
        title: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      setImagePreview(null);
      toast({
        title: "Não foi possível enviar a imagem. Tente novamente.",
      });
    } finally {
      setIsUploading(false);
    }
  }, [form, toast, imagePreview]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  // Handle select change for variations
  const handleSelectChange = (value) => {
    if (!selectedOptions.includes(value)) {
      setSelectedOptions((prev) => [...prev, value]); // Add new variation type
    }
  };

  // Handle removal of selected options
  const handleOptionDelete = (itemToDelete) => {
    setSelectedOptions((prev) => prev.filter((item) => item !== itemToDelete));
    form.setValue(
        "variations",
        selectedOptions.filter((item) => item !== itemToDelete)
    );
  };

  return (
      <ModalContent className={`overflow-y-auto`}>
        <Form {...form}>
          <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-dark-3 p-5 rounded-xl w-full mx-auto flex flex-col gap-3  flex-grow overflow-y-auto "
          >
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="col-end-3 col-start-1 ">
                      <FormLabel>Nome do produto</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Digite o nome do produto"
                            {...field}
                            className="bg-dark-3 border border-white/20 h-12 "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Digite a descrição do produto"
                            {...field}
                            className="bg-dark-3 border border-white/20 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Digite o preço do produto"
                            {...field}
                            className="bg-dark-3 border border-white/20 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="variations"
                render={({ field }) => (
                    <FormItem className="col-end-3 col-start-1">
                      <FormLabel>Opções</FormLabel>
                      <FormControl>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger className="bg-dark-4 w-full">
                            <SelectValue placeholder="Tema" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-4 text-white border-none z-[199]">
                            {options.map((option) => (
                                <SelectItem key={option._id} value={option.type}>
                                  {option.type}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className=" w-full flex gap-2 flex-wrap">
                        {selectedOptions.map((item) => (
                            <div
                                key={item}
                                className="border text-xs px-1 rounded-lg flex gap-1 items-center justify-center"
                            >
                              {item}
                              <X
                                  className="w-4"
                                  onClick={() => handleOptionDelete(item)}
                              />
                            </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Digite a categoria do produto"
                            {...field}
                            className="bg-dark-3 border border-white/20 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Digite o estoque"
                            {...field}
                            className="bg-dark-3 border border-white/20 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem className="col-end-3 col-start-1">
                      <FormLabel>Imagem</FormLabel>
                      <div
                          {...getRootProps()}
                          className="border-dashed border-2 border-gray-500 p-5 rounded-md cursor-pointer h-[300px] flex items-center justify-center max-sm:h-[150px]"
                      >
                        <input {...getInputProps()} />
                        {!imagePreview && !isUploading && (
                            <p>Arraste e solte uma imagem aqui ou clique para selecionar</p>
                        )}
                        {isUploading && (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                              <p>Enviando imagem...</p>
                            </div>
                        )}
                        {imagePreview && !isUploading && (
                            <div className="mt-2">
                              <img
                                  src={imagePreview}
                                  alt="Prévia da imagem"
                                  className="h-32 object-cover rounded-md"
                              />
                            </div>
                        )}
                      </div>

                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />

            <Button
                type="submit"
                className="col-start-1 col-end-3 py-2"
                disabled={isUploading}
            >
              {isUploading ? "Aguardando upload..." : "Salvar alterações"}
            </Button>
          </form>
        </Form>
      </ModalContent>
  );
};

UpdateModal.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    stock: PropTypes.number,
    imageUrl: PropTypes.string,
    variations: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
        })
    ),
  }).isRequired,
  refreshProducts: PropTypes.func.isRequired,
};

export default UpdateModal;