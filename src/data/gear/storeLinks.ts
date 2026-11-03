import type { StoreLinks } from "./types";

type StoreLinkOverrides = Partial<StoreLinks>;

export function createStoreLinks(
  brand: string,
  model: string,
  overrides: StoreLinkOverrides = {},
): StoreLinks {
  const query = `${brand} ${model}`;
  const encodedQuery = new URLSearchParams({ keyword: query }).toString();
  const encodedCatalogQuery = new URLSearchParams({ q: query }).toString();
  const encodedAmazonQuery = new URLSearchParams({ k: query }).toString();

  return {
    shopee: overrides.shopee ?? `https://shopee.ph/search?${encodedQuery}`,
    lazada: overrides.lazada ?? `https://www.lazada.com.ph/catalog/?${encodedCatalogQuery}`,
    amazon: overrides.amazon ?? `https://www.amazon.com/s?${encodedAmazonQuery}`,
  };
}
