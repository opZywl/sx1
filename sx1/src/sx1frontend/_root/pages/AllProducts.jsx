import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { getProductsFrontend } from "@/lib/api/api";
import LeftSidebar from "@/sx1frontend/components/LeftSidebar";
import RightSidebar from "@/sx1frontend/components/RightSidebar";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Loader, Settings2 } from "lucide-react";
import Filters from "@/sx1frontend/components/FIlters";
import { categories, sortOptions } from "@/lib/constants";
import SortOptions from "@/sx1frontend/components/SortOptions";
import { formatCurrencyBRL, normalizeImageUrl } from "@/lib/utils";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchKey = searchParams.toString();

  const filter = useMemo(
    () => searchParams.getAll("filter"),
    [searchKey]
  );
  const sortBy = searchParams.get("sortby") || "";
  const sizes = useMemo(
    () => searchParams.getAll("size"),
    [searchKey]
  );
  const colors = useMemo(
    () => searchParams.getAll("color"),
    [searchKey]
  );
  const techs = useMemo(
    () => searchParams.getAll("tech"),
    [searchKey]
  );
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 2000;

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await getProductsFrontend({
      filter: filter.join(","),
      sortBy,
      minPrice,
      maxPrice,
      sizes,
      colors,
      techs,
    });
    if (response.success) {
      setProducts(response.products);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filter, sortBy, minPrice, maxPrice, sizes, colors, techs]);

  const filteredProducts = useMemo(() => {
    const matchesCategory = (product) => {
      if (filter.length === 0) return true;
      const category = product.category?.toLowerCase() ?? "";
      return filter.some((item) => item.toLowerCase() === category);
    };

    const matchesSizes = (product) => {
      if (sizes.length === 0) return true;
      const productSizes = product.sizes?.map((size) => size.size) ?? [];
      return sizes.some((size) => productSizes.includes(size));
    };

    const matchesColors = (product) => {
      if (colors.length === 0) return true;
      const productColors =
        product.colors?.map((color) => color.name?.toLowerCase()) ?? [];
      return colors.some((color) => productColors.includes(color));
    };

    const matchesTech = (product) => {
      if (techs.length === 0) return true;
      const productTags = product.tags ?? [];
      return techs.some((tech) => productTags.includes(tech));
    };

    const matchesPrice =
      Number(product.price) >= minPrice && Number(product.price) <= maxPrice;

    const filtered = products.filter(
      (product) =>
        matchesCategory(product) &&
        matchesSizes(product) &&
        matchesColors(product) &&
        matchesTech(product) &&
        matchesPrice
    );

    if (sortBy === "high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    return filtered;
  }, [colors, filter, maxPrice, minPrice, products, sizes, sortBy, techs]);

  return (
    <div className=" max-w-6xl flex mx-auto max-sm:flex-col ">
      <LeftSidebar />
      <div className="mb-4 mx-2 sm:hidden">
        <Drawer>
          <DrawerTrigger className="flex gap-2 items-center justify-center font-mono p-1  rounded-md">
            Filtros <Settings2 className="w-4" />
          </DrawerTrigger>
          <DrawerContent className="border-none px-7 py-8 bg-dark-6 text-white">
            <div className="flex justify-between py-5">
              <div className="">
                <p className="text-xs my-2 text-zinc-400">CATEGORIAS</p>
                <Filters categories={categories} />
              </div>
              <div className="">
                <p className="text-xs my-2 text-zinc-400 text-end">ORDENAR POR</p>
                <SortOptions sortBy={sortOptions} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <BlurFade className="size-full relative max-sm:px-1 mx-auto px-6 grid md:grid-cols-3 grid-cols-2 gap-2 duration-200">
        {isLoading ? (
          <div className=" w-full h-screen absolute flex items-center justify-center">
            <Loader className="animate-spin w-6" />
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="relative p-7 h-[250px] xl:h-[300px] cursor-pointer overflow-hidden rounded-md border  border-dark-4 group bg-dark-1/40 flex justify-center items-center hover:border-blue-500 "
            >
              <img
                src={normalizeImageUrl(product.imageUrl)}
                className=" size-[85%] absolute m-auto inset-0 left-0 right-0 bottom-0 top-0 object-contain group-hover:scale-110  transition-all duration-300"
              />
              <div className="z-5 absolute bottom-2 left-0 mx-2 flex items-center gap-1 border border-light-2/20 pl-3 pr-1 py-1 rounded-full bg-zinc-600/10 backdrop-blur-lg backdrop-saturate-100">
                <p className="pr-1 text-xs line-clamp-1 capitalize">
                  {product.name}
                </p>
                <p className="bg-blue-700 rounded-full text-xs px-2 py-1">
                  {formatCurrencyBRL(product.price)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full h-screen absolute flex flex-col items-center justify-center gap-2 text-zinc-400">
            <p className="text-sm">Nenhum produto encontrado.</p>
            <p className="text-xs">Tente ajustar os filtros.</p>
          </div>
        )}
      </BlurFade>
      <RightSidebar />
    </div>
  );
};

export default AllProducts;
