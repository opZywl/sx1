import Marquee from "@/components/magicui/marquee";
import { ProductCard } from "@/components/magicui/ProductCard";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedProducts, getProductsFrontend, shuffleArray } from "@/lib/api/api";
import Nike from "@/sx1frontend/components/Nike";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Build display products: use featured first, fill remaining with random
  const buildDisplayProducts = () => {
    // Create array with 3 slots
    const display = [null, null, null];

    // Place featured products in their fixed positions
    featuredProducts.forEach((product) => {
      if (product.featuredPosition >= 1 && product.featuredPosition <= 3) {
        display[product.featuredPosition - 1] = product;
      }
    });

    // Get non-featured products to fill empty slots
    const featuredIds = featuredProducts.map((p) => p._id);
    const nonFeatured = shuffleArray(
      products.filter((p) => !featuredIds.includes(p._id))
    );

    // Fill empty slots with random products
    let nonFeaturedIndex = 0;
    for (let i = 0; i < 3; i++) {
      if (!display[i] && nonFeaturedIndex < nonFeatured.length) {
        display[i] = nonFeatured[nonFeaturedIndex];
        nonFeaturedIndex++;
      }
    }

    // Filter out null values and add classes
    return display.filter(Boolean).map((product, index) => {
      let className;
      if (index === 0) {
        className = `md:col-start-1 md:row-start-1 md:col-end-3 md:row-end-3 ${
          !loading && "animate-slideRight duration-1000"
        }`;
      } else if (index === 1) {
        className = !loading && "animate-slideLeft duration-1000";
      } else if (index === 2) {
        className = !loading && "animate-slideUp duration-1000";
      }
      return {
        ...product,
        className,
      };
    });
  };

  const displayProducts = buildDisplayProducts();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch both featured and all products
      const [featuredData, allData] = await Promise.all([
        getFeaturedProducts(),
        getProductsFrontend(),
      ]);

      if (featuredData && featuredData.products) {
        setFeaturedProducts(featuredData.products);
      }
      if (allData && allData.products) {
        setProducts(allData.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Nike />
      <div className="mt-2 px-3 h-full mx-auto">
        <h2 className="text-7xl m-5 font-bold pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white font-mono to-dark-4 bg-clip-text leading-none text-transparent max-sm:text-5xl max-sm:text-center mt-20 max-w-7xl mx-auto">
          DESTAQUES
        </h2>
        {loading ? (
          <BentoGrid className="max-w-7xl h-[80%] max-sm:min-h-screen mx-auto md:grid-cols-3 w-full">
            {displayProducts.map((item) => (
              <Skeleton key={item._id} className={item.className} />
            ))}
          </BentoGrid>
        ) : (
          <BentoGrid className="max-w-7xl h-[80%] max-sm:min-h-screen mx-auto md:grid-cols-3 w-full">
            {displayProducts.map((item) => (
              <BentoGridItem
                key={item._id}
                _id={item._id}
                name={item.name}
                price={item.price}
                {...item}
                className={` ${item.className}`}
              />
            ))}
          </BentoGrid>
        )}

        <div className="mt-3 relative">
          <Marquee className="[--duration:190s]">
            {products.slice(0, 10).map((item) => (
              <ProductCard key={item._id} {...item} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-dark-6 "></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-dark-6"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
