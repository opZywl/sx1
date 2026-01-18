import GlobalSearch from "./GlobalSearch.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useUserAuth } from "../context/UserAuthProvider.jsx";
import { Heart, LogIn, LogOut, ShoppingCart } from "lucide-react";
import Cart from "./Cart.jsx";
import MobileNav from "./MobileNav.jsx";
import { useDeviceWidth } from "../hooks/useDeviceWidth.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const RootNavbar = () => {
  const { isUserAuthenticated, userLogout } = useUserAuth();
  const isMobile = useDeviceWidth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [promoIndex, setPromoIndex] = useState(0);

  const promoMessages = [
    "Frete grátis para todo Brasil",
    "Parcelamento em até 12x",
    "Troca fácil em até 30 dias",
  ];

  const megaMenuItems = [
    {
      label: "Camisetas Retro",
      href: "/allproducts/?filter=Camisetas%20Retro",
      links: [
        { label: "Seleção Brasileira", href: "/allproducts/?filter=Camisetas%20Retro" },
        { label: "Clássicos Europeus", href: "/allproducts/?filter=Camisetas%20Retro" },
        { label: "Edições Limitadas", href: "/allproducts/?filter=Camisetas%20Retro" },
        { label: "Colecionáveis", href: "/allproducts/?filter=Camisetas%20Retro" },
      ],
      highlight: {
        title: "Retro Essentials",
        description: "A coleção que resgata os anos de ouro do futebol.",
      },
    },
    {
      label: "Times",
      href: "/allproducts/?filter=Times",
      links: [
        { label: "Brasileirão", href: "/allproducts/?filter=Times" },
        { label: "Europa", href: "/allproducts/?filter=Times" },
        { label: "Seleções", href: "/allproducts/?filter=Times" },
        { label: "Treino", href: "/allproducts/?filter=Times" },
      ],
      highlight: {
        title: "Favoritos da Torcida",
        description: "Camisas atuais dos times mais pedidos.",
      },
    },
    {
      label: "Copa",
      href: "/allproducts/?filter=Copa",
      links: [
        { label: "Uniformes Oficiais", href: "/allproducts/?filter=Copa" },
        { label: "Coleções especiais", href: "/allproducts/?filter=Copa" },
        { label: "Terceiros Kits", href: "/allproducts/?filter=Copa" },
        { label: "Limited Drops", href: "/allproducts/?filter=Copa" },
      ],
      highlight: {
        title: "Copa Collection",
        description: "Modelos inspirados nos maiores torneios.",
      },
    },
    {
      label: "Sneakers",
      href: "/allproducts/?filter=Sneakers",
      links: [
        { label: "Lifestyle", href: "/allproducts/?filter=Sneakers" },
        { label: "Performance", href: "/allproducts/?filter=Sneakers" },
        { label: "Futsal", href: "/allproducts/?filter=Sneakers" },
        { label: "Treino", href: "/allproducts/?filter=Sneakers" },
      ],
      highlight: {
        title: "Sneaker Lab",
        description: "Os drops mais desejados da temporada.",
      },
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [promoMessages.length]);

  return (
    <div className="w-full max-sm:absolute z-20 top-0">
      <div className="bg-dark-7 text-zinc-200 text-xs sm:text-sm py-2 px-4 text-center">
        <span className="font-medium">{promoMessages[promoIndex]}</span>
      </div>
      <nav className="bg-dark-6 max-sm:gap-1 py-2 w-full flex items-center justify-between max-sm:px-3 px-6">
        <div className="h-7">
          <MobileNav />
        </div>
        <div className="flex w-full max-sm:w-max items-center gap-7">
          <Link to={`/`} className="flex items-center gap-3 max-sm:gap-1">
            <img src="/icons/navbar.svg" className="w-11" />
            <h2 className="font-bold line-clamp-1 max-md:hidden max-sm:block">
              sx1 Imports
            </h2>
          </Link>
          <div className="flex max-sm:hidden items-center gap-3">
            <NavigationMenu>
              <NavigationMenuList>
                {megaMenuItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-6 w-[540px]">
                      <div className="grid grid-cols-[1.2fr_1fr] gap-6">
                        <div className="grid grid-cols-2 gap-3">
                          {item.links.map((link) => (
                            <NavigationMenuLink asChild key={link.label}>
                              <Link
                                to={link.href}
                                className="rounded-md border border-dark-4 px-3 py-2 text-sm text-zinc-200 hover:border-blue-500 hover:text-white transition"
                              >
                                {link.label}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        <div className="rounded-xl border border-dark-4 p-4 bg-dark-5/40 flex flex-col justify-between">
                          <div>
                            <p className="text-xs uppercase text-zinc-400">
                              Destaque
                            </p>
                            <h3 className="text-lg font-semibold">
                              {item.highlight.title}
                            </h3>
                            <p className="text-sm text-zinc-300 mt-2">
                              {item.highlight.description}
                            </p>
                          </div>
                          <Link
                            to={item.href}
                            className="mt-4 inline-flex text-sm text-blue-400 hover:text-blue-300"
                          >
                            Ver coleção
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/allproducts">Todos</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex sm:w-full h-7 gap-2 max-sm:gap-1 px-1 justify-end">
          {!isMobile && (
            <div className="w-full max-sm:hidden flex justify-end">
              <GlobalSearch />
            </div>
          )}
          <Menubar>
            <MenubarMenu className="bg-dark-6">
              <MenubarTrigger className="bg-dark-6 px-2 py-1 h-full sm:border border-dark-4">
                {!isUserAuthenticated ? (
                  <LogIn className="sm:max-w-4" />
                ) : (
                  <LogOut className="sm:max-w-4" />
                )}
              </MenubarTrigger>
              <MenubarContent>
                {!isUserAuthenticated ? (
                  <>
                    <MenubarItem>
                      <Link to="/signup" className="w-full px-2 py-1">
                        Sign-up
                      </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link to="/login" className="w-full px-2 py-1">
                        Log-in
                      </Link>
                    </MenubarItem>
                  </>
                ) : (
                  <MenubarItem>
                    <Button
                      onClick={userLogout}
                      className="w-full px-2 py-1 bg-dark-6"
                    >
                      Log-out
                    </Button>
                  </MenubarItem>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <Button
            className="sm:border hover:bg-transparent group h-full border-dark-4 bg-dark-6 px-2 relative"
            aria-label="Lista de desejos"
          >
            {wishlistItems.length <= 0 ? (
              <Heart className="sm:max-w-4" />
            ) : (
              <div className="">
                <Heart className="sm:max-w-4" />
                <div className="absolute -top-1.5 -right-0 text-xs font-mono">
                  {wishlistItems.length}
                </div>
              </div>
            )}
          </Button>

          <Sheet>
            <SheetTrigger className="h-full" asChild>
              <Button className="sm:border hover:bg-transparent group h-full border-dark-4 bg-dark-6 px-2 relative">
                {cartItems.length <= 0 ? (
                  <ShoppingCart className="sm:max-w-4" />
                ) : (
                  <div className="">
                    <ShoppingCart className="sm:max-w-4" />
                    <div className="absolute -top-1.5 -right-0 text-xs font-mono">
                      {cartItems.length}
                    </div>
                  </div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="text-white">
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default RootNavbar;
