// @/zin-admin/lib/constants/index.js or index.ts
import { AmpersandIcon, DeleteIcon, List, Plus, User } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";

export const productMenu = [
  {
    Icon: Plus,
    name: "Adicionar produtos",
    description: "Popule seu site de e-commerce",
    href: "/admin/addproducts",
    cta: "Ir para",
    className: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
  },
  {
    Icon: UpdateIcon,
    name: "Atualizar produtos",
    description: "Atualize informações de produtos existentes",
    href: "/admin/updateproducts",
    cta: "Saiba mais",
    className: "md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4",
  },
  {
    Icon: List,
    name: "Lista de produtos",
    description: "Veja a lista de todos os produtos",
    href: "/admin/productslist",
    cta: "Saiba mais",
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
  {
    Icon: DeleteIcon,
    name: "Excluir produtos",
    description: "Exclua seus produtos",
    href: "/admin/deleteproducts",
    cta: "Saiba mais",
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
];

export const variants = [
  {
    Icon: AmpersandIcon,
    name: "Adicionar variações",
    description: "Adicione variações aos seus produtos",
    href: "/admin/addvariant",
    cta: "Ir para",
    className: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
  },
  {
    Icon: UpdateIcon,
    name: "Atualizar variação",
    description: "Atualize informações de variações existentes",
    href: "/admin/updateproducts",
    cta: "Saiba mais",
    className: "md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4",
  },
  {
    Icon: List,
    name: "Lista de produtos",
    description: "Veja a lista de todos os produtos",
    href: "/admin/productslist",
    cta: "Saiba mais",
    className: "md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4",
  },
  {
    Icon: Plus,
    name: "Adicionar produtos",
    description: "Popule seu site de e-commerce",
    href: "/admin/addproducts",
    cta: "Saiba mais",
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
  {
    Icon: User,
    name: "Clientes",
    description: "Gerencie os clientes da sua loja",
    href: "/admin/users",
    cta: "Ir para",
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
];

export const admindashboard = [
  {
    Icon: AmpersandIcon,
    name: "Adicionar produtos",
    description: "Adicione produtos",
    href: "/admin/addproducts",
    cta: "Ir para",
    className: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
  },
  {
    Icon: UpdateIcon,
    name: "Atualizar produtos",
    description: "Atualize informações de produtos existentes",
    href: "/admin/updateproducts",
    cta: "Saiba mais",
    className: "md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4",
  },
  {
    Icon: List,
    name: "Lista de produtos",
    description: "Veja a lista de todos os produtos",
    href: "/admin/productslist",
    cta: "Saiba mais",
    className: "md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4",
  },
  {
    Icon: Plus,
    name: "Adicionar produtos",
    description: "Popule seu site de e-commerce",
    href: "/admin/addproducts",
    cta: "Saiba mais",
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
  {
    Icon: User,
    name: "Clientes",
    description: "Gerencie os clientes da sua loja",
    href: "/admin/users",
    cta: "Ir para",
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
];

export const usersMenu = [
  {
    Icon: User,
    name: "Clientes",
    description: "Gerencie os clientes da sua loja",
    href: "/admin/users",
    cta: "Ir para",
    className: "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3",
  },
  {
    Icon: AmpersandIcon,
    name: "Administradores",
    description: "Gerencie os administradores",
    href: "/admin/admin-users",
    cta: "Ir para",
    className: "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-3",
  },
];

export const categories = [
  { name: "Todos", value: "" },
  { name: "Infantil", value: "kids" },
  { name: "Masculino", value: "mens" },
  { name: "Feminino", value: "womens" },
  { name: "Calçados", value: "footwear" },
  { name: "Eletrônicos", value: "electronics" },
  { name: "Acessórios", value: "accessories" },
];

export const sortOptions = [
  { name: "Nenhum", value: "" },
  { name: "Últimas novidades", value: "latest" },
  { name: "Preço: maior para menor", value: "high" },
  { name: "Preço: menor para maior", value: "low" },
];
