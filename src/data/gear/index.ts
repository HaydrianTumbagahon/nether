import { keyboards } from './keyboards';
import { keyboardBrands } from './keyboards';
import { mice, mouseBrands } from './mice';
import { iems, iemBrands } from './iems';
import { GEAR_IMAGE_HOSTS } from './hosts';
import { createStoreLinks } from './storeLinks';
import type { GearItem, Iem, Keyboard, Mouse } from './types';

const isProd = process.env.NODE_ENV === 'production';
let checked = false;

function validateGear(): void {
  const all: GearItem[] = [...keyboards, ...mice, ...iems];
  const seen = new Set<string>();
  const brandsByKind = {
    keyboard: new Set(keyboardBrands.map((brand) => brand.name)),
    mouse: new Set(mouseBrands.map((brand) => brand.name)),
    iem: new Set(iemBrands.map((brand) => brand.name)),
  };

  for (const [kind, brands] of Object.entries({ keyboard: keyboardBrands, mouse: mouseBrands, iem: iemBrands })) {
    const slugs = new Set<string>();
    for (const brand of brands) {
      if (slugs.has(brand.slug)) throw new Error(`Duplicate ${kind} brand slug "${brand.slug}"`);
      slugs.add(brand.slug);
    }
  }

  for (const item of all) {
    const where = `Gear "${item.id}"`;
    if (![item.id, item.brand, item.name].every((value) => value.trim().length > 0)) {
      throw new Error(`${where}: id, brand, and name are required`);
    }
    if (seen.has(item.id)) throw new Error(`${where}: duplicate id`);
    seen.add(item.id);
    if (!brandsByKind[item.kind].has(item.brand)) {
      throw new Error(`${where}: brand "${item.brand}" does not exactly match its ${item.kind} brand list`);
    }
    if (item.score !== undefined && !(item.score >= 0 && item.score <= 10)) {
      throw new Error(`${where}: score must be 0 to 10`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.updated)) throw new Error(`${where}: updated must be YYYY-MM-DD`);
    for (const [store, url] of Object.entries(item.links ?? {})) {
      if (url && !url.startsWith('https://')) throw new Error(`${where}: ${store} link must be https`);
    }
    for (const img of item.images ?? []) {
      let host = '';
      try {
        const u = new URL(img.url);
        if (u.protocol !== 'https:') throw new Error('not https');
        host = u.hostname;
      } catch {
        throw new Error(`${where}: image url must be a valid https URL (${img.url})`);
      }
      if (!GEAR_IMAGE_HOSTS.includes(host)) {
        throw new Error(`${where}: image host "${host}" is not approved. Add it to src/data/gear/hosts.ts and next.config.ts after the brand approves.`);
      }
    }
  }
  if (!isProd) return;
}

function prepare<T extends GearItem>(items: T[]): T[] {
  if (!checked) {
    validateGear();
    checked = true;
  }
  return items
    .filter((i) => !(isProd && i.example))
    .map((item) => item.links === undefined
      ? { ...item, links: createStoreLinks(item.brand, item.name) }
      : item)
    .sort((a, b) => {
      if (a.score === undefined || b.score === undefined) {
        if (a.score === b.score) return a.name.localeCompare(b.name);
        return a.score === undefined ? 1 : -1;
      }
      return b.score === a.score ? a.name.localeCompare(b.name) : b.score - a.score;
    });
}

export const getKeyboards = (): Keyboard[] => prepare(keyboards);
export const getMice = (): Mouse[] => prepare(mice);
export const getIems = (): Iem[] => prepare(iems);

export function getGearById(id: string): GearItem | undefined {
  return [...getKeyboards(), ...getMice(), ...getIems()].find((i) => i.id === id);
}
