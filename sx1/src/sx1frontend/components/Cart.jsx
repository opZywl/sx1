import { useEffect } from "react";
import CartItemCard from "./CartItemCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/utils";

const Cart = () => {
  const { cartItems, fetchCart, cartTotal } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="">
        <h4 className="font-bold text-xl">Meu carrinho</h4>
        <div className="h-full mt-5 flex flex-col">
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <CartItemCard
                {...product.products}
                quantity={product.quantity}
                itemTotal={product.itemTotal}
                key={product.products._id}
              />
            ))
          ) : (
            <>Nenhum item</>
          )}
        </div>
      </div>
      {cartItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-zinc-700 py-1 font-mono items-end text-base text-zinc-400">
            <p>Impostos</p>
            <p className="text-base font-mono text-white">
              {formatCurrencyBRL(0)}
            </p>
          </div>
          <div className="flex justify-between border-b border-zinc-700 py-1 font-mono items-end text-base text-zinc-400">
            <p>Total</p>
            <p className="text-base font-mono text-white">
              {formatCurrencyBRL(cartTotal)}
            </p>
          </div>
          <Button className="py-2 rounded-full px-3 bg-blue-700">
            Finalizar compra
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
