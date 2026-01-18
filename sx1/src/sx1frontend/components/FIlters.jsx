import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const priceBounds = { min: 0, max: 2000 };

const Filters = ({ categories = [] }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState({
    min: priceBounds.min,
    max: priceBounds.max,
  });

  const searchKey = searchParams.toString();
  const selectedFilters = useMemo(
    () => ({
      categories: searchParams.getAll("filter"),
      sizes: searchParams.getAll("size"),
      colors: searchParams.getAll("color"),
      techs: searchParams.getAll("tech"),
    }),
    [searchKey]
  );

  const sizeOptions = ["PP", "P", "M", "G", "GG"];
  const colorOptions = [
    { name: "Preto", value: "preto", hex: "#0f0f0f" },
    { name: "Branco", value: "branco", hex: "#f5f5f5" },
    { name: "Vermelho", value: "vermelho", hex: "#ef4444" },
    { name: "Azul", value: "azul", hex: "#3b82f6" },
    { name: "Verde", value: "verde", hex: "#22c55e" },
  ];
  const techOptions = ["Dry", "Repel", "Thermo", "Flex", "UV"];

  const toggleParamValue = (key, value) => {
    const params = new URLSearchParams(searchParams);
    const current = params.getAll(key);
    if (value === "") {
      params.delete(key);
      navigate(`/allproducts?${params.toString()}`);
      return;
    }
    if (current.includes(value)) {
      const updated = current.filter((item) => item !== value);
      params.delete(key);
      updated.forEach((item) => params.append(key, item));
    } else {
      params.append(key, value);
    }
    navigate(`/allproducts?${params.toString()}`);
  };

  const updatePriceParams = (nextRange) => {
    const params = new URLSearchParams(searchParams);
    params.set("minPrice", String(nextRange.min));
    params.set("maxPrice", String(nextRange.max));
    navigate(`/allproducts?${params.toString()}`);
  };

  useEffect(() => {
    const min = Number(searchParams.get("minPrice")) || priceBounds.min;
    const max = Number(searchParams.get("maxPrice")) || priceBounds.max;
    setPriceRange({ min, max });
  }, [searchParams]);
  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] text-dark-5/70">CATEGORIAS</h3>
        {categories.map((filter) => {
          const isAll = filter.value === "";
          const isChecked = isAll
            ? selectedFilters.categories.length === 0
            : selectedFilters.categories.includes(filter.value);
          return (
            <div key={filter.value || "all"} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`category-${filter.value || "all"}`}
              checked={isChecked}
              onChange={() => toggleParamValue("filter", filter.value)}
              className="h-3 w-3 accent-blue-600"
            />
            <Label
              className="cursor-pointer text-xs hover:underline underline-offset-1 transition-all max-sm:text-base"
              htmlFor={`category-${filter.value || "all"}`}
            >
              {filter.name}
            </Label>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] text-dark-5/70">TAMANHOS</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => toggleParamValue("size", size)}
              className={`rounded-full border px-3 py-1 text-xs ${
                selectedFilters.sizes.includes(size)
                  ? "border-blue-500 text-blue-200"
                  : "border-dark-4 text-zinc-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] text-dark-5/70">CORES</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => toggleParamValue("color", color.value)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                selectedFilters.colors.includes(color.value)
                  ? "border-blue-500 text-blue-200"
                  : "border-dark-4 text-zinc-400"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] text-dark-5/70">TECNOLOGIA</h3>
        <div className="flex flex-wrap gap-2">
          {techOptions.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleParamValue("tech", tech)}
              className={`rounded-full border px-3 py-1 text-xs ${
                selectedFilters.techs.includes(tech)
                  ? "border-blue-500 text-blue-200"
                  : "border-dark-4 text-zinc-400"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] text-dark-5/70">PREÇO</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-400" htmlFor="min-price">
              Mín
            </label>
            <input
              id="min-price"
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange.min}
              onChange={(event) =>
                setPriceRange((prev) => ({
                  ...prev,
                  min: Math.min(Number(event.target.value), prev.max),
                }))
              }
              className="w-full"
            />
            <span className="text-xs text-zinc-400">R$ {priceRange.min}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-400" htmlFor="max-price">
              Máx
            </label>
            <input
              id="max-price"
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange.max}
              onChange={(event) =>
                setPriceRange((prev) => ({
                  ...prev,
                  max: Math.max(Number(event.target.value), prev.min),
                }))
              }
              className="w-full"
            />
            <span className="text-xs text-zinc-400">R$ {priceRange.max}</span>
          </div>
          <Button
            className="bg-blue-700 hover:bg-blue-600 text-xs py-1"
            onClick={() => updatePriceParams(priceRange)}
          >
            Aplicar faixa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
