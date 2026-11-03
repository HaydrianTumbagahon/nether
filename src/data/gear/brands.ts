import { keyboardBrands } from './keyboards';
import { mouseBrands } from './mice';
import { iemBrands } from './iems';

export type Brand = { slug: string; name: string; country?: string; blurb: string; url?: string };

export const brands: Brand[] = [...keyboardBrands, ...mouseBrands, ...iemBrands];

export function getBrand(name: string): Brand | undefined {
  const n = name.toLowerCase();
  return brands.find((b) => b.name.toLowerCase() === n || b.slug === n);
}
