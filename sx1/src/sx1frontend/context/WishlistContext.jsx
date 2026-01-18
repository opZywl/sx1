import { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const WishlistContext = createContext();
const storageKey = "wishlistItems";

const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  const toggleWishlistItem = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }
      const imageUrl =
        product.mainImage ||
        product.imageUrl ||
        product.images?.[0]?.url ||
        "";
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl,
        },
      ];
    });
  };

  const removeWishlistItem = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const value = useMemo(
    () => ({
      wishlistItems,
      toggleWishlistItem,
      isInWishlist,
      removeWishlistItem,
    }),
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WishlistProvider;

export const useWishlist = () => useContext(WishlistContext);
