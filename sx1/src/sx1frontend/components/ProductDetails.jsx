import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { addItemToCart, getProductById } from "@/lib/api/api";
import { formUrlQuery, formatCurrencyBRL, normalizeImageUrl } from "@/lib/utils";
import { Heart, Loader, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
} from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import SizeGuideModal from "./SizeGuideModal.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(true); // State to control the button
  const { fetchCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();

  const colorOptions = product?.colors ?? [];
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const selectedColorVariant = colorOptions.find(
      (color) => color.name === selectedColor
    );
    const colorImages =
      selectedColorVariant?.images?.map((image) => ({ url: image })) ?? [];
    const baseImages =
      product.images?.map((image) => ({ url: image.url })) ??
      (product.imageUrl ? [{ url: product.imageUrl }] : []);

    return colorImages.length > 0 ? colorImages : baseImages;
  }, [colorOptions, product, selectedColor]);

  // Function to handle variant selection
  const handleVariantSelect = (type, option) => {
    const updatedVariants = { ...selectedVariants, [type]: option };

    // Update the URL query parameters
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: type,
      value: option,
    });
    navigate(newUrl);

    setSelectedVariants(updatedVariants);
  };

  // Function to remove variant from URL
  const handleVariantDeselect = (type) => {
    const updatedVariants = { ...selectedVariants };
    delete updatedVariants[type];

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(type);

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });

    setSelectedVariants(updatedVariants);
  };

  // Add item to cart
  const addItem = async () => {

    const token = localStorage.getItem('UserCookie')
    

    const item = await addItemToCart(id); // Include selected variants when adding to cart
    fetchCart();
    if (item.success) {
      toast({
        title: "Item adicionado.",
      })
    }else if(!token){
      toast({ title: "Faça login para adicionar ao carrinho" })
    } else{
      toast({ title: "Erro" })
    }
  };

  // Function to check if all variant types have been selected
  const checkIfAllVariantsSelected = () => {
    if (!product) return false;
    return product.variations.every(
      (variant) => selectedVariants[variant.type]
    );
  };

  // UseEffect to update the button's disabled state based on variant selections
  useEffect(() => {
    setIsAddToCartDisabled(!checkIfAllVariantsSelected());
  }, [selectedVariants, product]);

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0].url);
    }
  }, [galleryImages]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductById(id);
      if (response.success) {
        setProduct(response.product);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="size-full absolute flex items-center justify-center">
      <Loader className="size-10 animate-spin"/>
    </div>;
  }

  return (
    <>
      <div className="flex max-sm:flex-col max-sm:justify-center bg-dark-2 w-[95%] xl:w-[75%] min-h-[85vh] md:max-h-[900px] mx-auto mt-5 rounded-md px-5 max-sm:py-3">
        <div className="w-[70%] max-sm:w-full max-sm:border-b pb-5 border-dark-5/30">
          <div className="grid grid-cols-1 lg:grid-cols-[110px_1fr] gap-4 h-full">
            <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[650px]">
              {galleryImages.map((image) => {
                const isActive = selectedImage === image.url;
                return (
                  <button
                    key={image.url}
                    className={`border ${
                      isActive ? "border-blue-700" : "border-dark-5/20"
                    } rounded-md p-1 min-w-[82px] bg-dark-3/70`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <img
                      src={normalizeImageUrl(image.url)}
                      alt={`${product.name} miniatura`}
                      className="h-16 w-full object-cover rounded-md"
                    />
                  </button>
                );
              })}
            </div>
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="group relative w-full h-full max-h-[650px] rounded-2xl bg-dark-3/70 flex items-center justify-center">
                <img
                  src={normalizeImageUrl(selectedImage || product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 py-12 max-sm:w-full max-sm:p-0">
          <div className="mx-3 py-6 flex flex-col gap-3 border-b border-dark-5/30 max-sm:flex-row max-sm:justify-between max-sm:items-center max-sm:border-none max-sm:py-5">
            <div className="flex flex-col gap-2">
              <nav className="text-xs text-zinc-400 flex items-center gap-2">
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
                <span>/</span>
                <Link
                  to={`/allproducts/?filter=${product.category}`}
                  className="hover:text-white"
                >
                  {product.category}
                </Link>
                <span>/</span>
                <span className="text-zinc-300">{product.name}</span>
              </nav>
              <h1 className="text-5xl font-bold text-wrap max-sm:text-2xl capitalize">
                {product.name}
              </h1>
              <span className="text-sm text-zinc-400/90">
                {product.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-700 w-max font-semibold p-2 px-3 rounded-full text-base max-sm:text-xs flex font-mono items-center justify-center h-max">
                {formatCurrencyBRL(product.price)}
              </span>
              <button
                className="border border-dark-4 rounded-full p-2 hover:border-blue-700 transition-colors"
                onClick={() => toggleWishlistItem(product)}
                aria-label="Adicionar à lista de desejos"
                aria-pressed={isInWishlist(product._id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product._id)
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-300"
                  }`}
                />
              </button>
            </div>
          </div>

          {colorOptions.length > 0 && (
            <div className="mx-3 py-4 border-b border-dark-5/30">
              <p className="text-xl max-sm:text-sm mb-3">Cores</p>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => {
                  const isActive = selectedColor === color.name;
                  const previewImage = color.images?.[0];
                  return (
                    <button
                      key={color.name}
                      className={`h-12 w-12 rounded-full border-2 ${
                        isActive ? "border-blue-700" : "border-dark-5/20"
                      } flex items-center justify-center overflow-hidden`}
                      onClick={() => setSelectedColor(color.name)}
                      aria-label={`Selecionar cor ${color.name}`}
                    >
                      {previewImage ? (
                        <img
                          src={normalizeImageUrl(previewImage)}
                          alt={color.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          className="h-full w-full rounded-full"
                          style={{ backgroundColor: color.hexCode || "#1f1f1f" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedColor && (
                <p className="text-sm text-zinc-400/80 mt-2">
                  Cor selecionada: {selectedColor}
                </p>
              )}
            </div>
          )}

          <div className="mx-3 py-6 max-sm:py-0 text-sm font-medium flex flex-col justify-between gap-3">
            {product.variations.map((item) => {
              const isSizeType =
                item.type.toLowerCase().includes("tamanho") ||
                item.type.toLowerCase().includes("size");
              return (
                <div
                  key={item._id}
                  className="flex flex-col gap-2 items-start justify-center my-1.5 max-sm:m-0"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xl max-sm:text-sm">{item.type}</p>
                    {isSizeType && (
                      <SizeGuideModal />
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {item.options.map((option) => {
                      const isSelected = selectedVariants[item.type] === option;
                      return (
                        <div
                          key={option}
                          className={`${
                            isSelected ? "border-blue-700" : "border-dark-5/10"
                          } bg-dark-4/80 p-1 px-3 rounded-full text-sm font-normal cursor-pointer border-2`}
                          onClick={() =>
                            isSelected
                              ? handleVariantDeselect(item.type)
                              : handleVariantSelect(item.type, option)
                          }
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm mx-3 my-6 line-clamp-3 text-zinc-400/80">
            {product.description}
          </p>
          <Button
            onClick={addItem}
            className="bg-blue-700 relative p-2 w-full font-bold rounded-full hover:bg-blue-900/80 group transition-all"
            disabled={isAddToCartDisabled}
          >
            <Plus className="w-4 absolute left-5 group-hover:rotate-45 transition-all" />
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
