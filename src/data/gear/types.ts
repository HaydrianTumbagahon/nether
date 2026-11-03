import type { IEM as IemData } from "./iems";
import type { Mouse as MouseData } from "./mice";

export type Tier = 'Budget' | 'Mid-range' | 'Premium';
export type Verdict = 'Buy' | 'Buy on sale' | 'Wait' | 'Skip';
export type SpecsStatus = 'verified' | 'from-notes';
export type PricePhp = { min: number; max: number; asOf: string; note?: string };

/** Remote image. No files are saved in the repo; the host must be listed in hosts.ts and next.config.ts. */
export type GearImageRef = { url: string; alt: string; credit?: string; sourcePage?: string };
export type StoreLinks = Partial<Record<'shopee' | 'lazada' | 'amazon', string>>;

type Base = {
  id: string;
  brand: string;
  name: string;
  price?: number;
  tier: Tier;
  summary: string; // 1 to 2 sentences
  description: string;
  looks: string;
  pricePhp?: PricePhp | null;
  specsStatus: SpecsStatus;
  images?: GearImageRef[];
  good: string[];
  annoying: string[];
  insight: string[]; // each string is one short paragraph
  score: number; // 0 to 10
  handsOn: boolean; // false = paper score
  verdict: Verdict;
  verdictLine: string;
  bestFor: string[];
  links?: StoreLinks;
  updated: string; // YYYY-MM-DD
  example?: true; // dev-only sample entry, never shown in production
};

export type Keyboard = Base & {
  kind: 'keyboard';
  layout: '60%' | '65%' | '75%' | 'TKL' | '96%' | 'Full' | 'Other';
  connectivity: ('USB-C' | 'Bluetooth' | '2.4 GHz')[];
  caseMaterial: string;
  mount: 'Gasket' | 'Top' | 'Tray' | 'Sandwich' | 'Integrated' | 'Unknown';
  hotSwap: boolean | null;
  switches: {
    stock: string;
    type: 'Linear' | 'Tactile' | 'Clicky' | 'Hall effect' | 'Optical' | 'Other';
    actuationG?: number;
    options?: string[];
  };
  keycaps: { material: 'PBT' | 'ABS' | 'Other' | 'Unknown'; profile?: string };
  backlight: 'None' | 'White' | 'RGB' | 'Unknown';
  software?: string;
  weightG?: number;
  battery?: string;
  notes?: { sound?: string; feel?: string; mods?: string };
};

export type Mouse = MouseData & { links?: StoreLinks; example?: true };
export type Iem = IemData & { links?: StoreLinks; example?: true };

export type GearItem = Keyboard | Mouse | Iem;
