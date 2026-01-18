import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formUrlQuery = ({ params, key, value }) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};


export const removeKeysFromQuery = ({
  params,
  keysToRemove
}) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl
    },
    { skipNull: true }
  );
};

export const formatCurrencyBRL = (value) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
};

const normalizeHost = (host) => {
  if (!host) {
    return "";
  }
  return host.endsWith("/") ? host.slice(0, -1) : host;
};

export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  let url = imageUrl;
  const backendHost = normalizeHost(import.meta.env.VITE_BACKEND_HOST);
  const frontendHost = normalizeHost(import.meta.env.VITE_FRONTEND_HOST);

  // Handle relative /uploads/ paths
  if (url.startsWith("/uploads/")) {
    url = `${backendHost}${url}`;
  }

  // Handle frontend host URLs with /uploads/
  if (frontendHost && url.startsWith(frontendHost) && url.includes("/uploads/")) {
    url = url.replace(frontendHost, backendHost);
  }

  // Convert HTTP to HTTPS for all URLs (fix Mixed Content issues)
  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  return url;
};
