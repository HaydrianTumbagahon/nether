// ---------- TYPES (kept in this file so it stands alone) ----------
type Tier = 'Budget' | 'Mid-range' | 'Premium';
type Verdict = 'Buy' | 'Buy on sale';
type SpecsStatus = 'verified' | 'from-notes';
type PricePhp = { min: number; max: number; asOf: string; note?: string };
type ProductImage = { url: string; alt: string; credit: string; sourcePage: string };
type Brand = { slug: string; name: string; country?: string; blurb: string; url?: string };

export type MouseConnectivity = 'Wired' | 'Wireless' | 'Bluetooth' | '2.4 GHz';

export interface Mouse {
  kind: 'mouse';
  id: string;
  brand: string;
  name: string;
  tier: Tier;
  summary: string;
  description: string;
  looks: string;
  pricePhp: PricePhp;
  specsStatus: SpecsStatus;
  good: string[];
  annoying: string[];
  insight: string[];
  score: number;
  handsOn: boolean;
  verdict: Verdict;
  verdictLine: string;
  bestFor: string[];
  updated: string;
  images?: ProductImage[];

  // Filters: type and connectivity
  formFactor: 'Mouse' | 'Trackball';
  sensorType: 'Optical' | 'Laser' | 'Mechanical' | 'Unknown';
  // 'Wireless' = wireless but the mode is not known. Empty array = not known at all.
  connectivity: MouseConnectivity[];

  // Specs (all optional because notes do not always list them)
  sensor?: string;
  dpiMax?: number;
  weightG?: number;
  battery?: string;
  switches?: string;
  shape?: string;
  features?: string[];
  notes?: {
    shape?: string;
    clicks?: string;
    tracking?: string;
    battery?: string;
    mods?: string;
  };
}

// HOW TO READ THIS FILE
// - specsStatus 'from-notes': every spec here comes only from your notes. None of it has been checked against manufacturer or retailer pages yet.
//   The UI should show a badge. Change an entry to 'verified' once you have checked it.
// - pricePhp: typical street price from YOUR list, not checked at Shopee or Lazada. Show as "about", and tell readers to check the store.
//   Where one range covers a series or two models, the note says so.
// - Empty `connectivity: []`, `sensorType: 'Unknown'` or a missing spec means your notes did not say. Fill these in before relying on the sort and filter.
// - Weights are approximate (your notes say "~"). Entries with no weight in your notes have no weightG.
// - description / looks / insight: written from your notes only. `looks` is a paper impression, not something I handled. Edit it after you have seen the mouse.
// - Scores and verdicts are PAPER scores (handsOn: false). Change any number freely. Set handsOn: true only for mice you have used.
// - No images yet: add `images: [{ url, alt, credit, sourcePage }]` after a brand approves.
// - The Rakk brand entry also exists in keyboards.ts. Merge the brand lists if your site needs one entry per brand.

export const mouseBrands: Brand[] = [
  { slug: 'rakk', name: 'Rakk', country: 'Philippines', blurb: 'Philippine peripherals brand sold through EASY PC and its own Shopee and Lazada stores. Its recent mice lean lightweight and feature-rich.' },
  { slug: 'aula', name: 'Aula', country: 'China', blurb: 'Budget-focused peripherals maker. Its X9 / V9 mice are known for strong coatings and competitive performance for the price.' },
  { slug: 'logitech', name: 'Logitech', country: 'Switzerland', blurb: 'Long-established mouse brand. It covers office and creative work with the MX line, trackballs, and reliable gaming mice like the G304 and G203.' },
  { slug: 'vxe', name: 'VXE', blurb: 'Brand known for lightweight performance mice at accessible prices, including the Dragonfly line.' },
  { slug: 'attack-shark', name: 'Attack Shark', blurb: 'Feature-heavy budget mice, often bundled with extras such as a charging dock.' },
  { slug: 'redragon', name: 'Redragon', blurb: 'Budget gaming peripherals brand with basic, low-priced wired mice.' },
  { slug: 'fantech', name: 'Fantech', blurb: 'Gaming peripherals brand with good local availability and support in the Philippines.' },
  { slug: 'razer', name: 'Razer', blurb: 'Gaming brand whose DeathAdder shape is one of the best-known mouse designs.' },
];

export const mice: Mouse[] = [
  // ======================= BUDGET =======================
  {
    kind: 'mouse',
    id: 'rakk-dasig-x',
    brand: 'Rakk',
    name: 'Dasig X',
    tier: 'Budget',
    summary: 'A lightweight tri-mode mouse with hot-swap switches. A clear step up from the original Dasig and a solid local option.',
    description: 'The Dasig X is a tri-mode mouse from Rakk with a PAW3325 sensor, hot-swappable Huano switches and a weight of about 80 g. It is positioned as an upgrade over the original Dasig.',
    looks: 'Paper impression only: a practical everyday mouse rather than a showpiece. The hot-swap switches are the interesting part, so check how easy they are to reach.',
    pricePhp: { min: 900, max: 1300, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Hot-swappable Huano switches mean you can change the click feel',
      'Tri-mode connectivity at a low price',
      'Clear upgrade over the original Dasig',
      'Local brand, so support is easier to reach',
    ],
    annoying: [
      'At about 80 g it is heavier than the lightest mice in this price range',
      'PAW3325 is a more modest sensor than the PAW3395 on pricier mice',
    ],
    insight: [
      'The main story here is the upgrade. Compared with the original Dasig it adds practical things like hot-swap clicks while staying light and cheap.',
      'It is aimed at buyers who want a useful wireless mouse without spending much. The price makes it hard to complain about.',
      'If weight matters most, the Tanaw and Kala from the same brand are lighter, but they cost more.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A solid local pick for everyday use and light gaming. Check which switches come in the box.',
    bestFor: ['Budget wireless mouse', 'Tinkering with click feel', 'Everyday and light gaming use'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: ['Wired', 'Bluetooth', '2.4 GHz'],
    sensor: 'PAW3325',
    weightG: 80,
    switches: 'Hot-swappable Huano',
    features: ['Tri-mode connectivity', 'Hot-swap switches'],
  },
  {
    kind: 'mouse',
    id: 'rakk-tanaw',
    brand: 'Rakk',
    name: 'Tanaw',
    tier: 'Budget',
    summary: 'One of the stronger recent Rakk mice: very light, with a PAW3395 sensor and a small onboard screen.',
    description: 'The Tanaw is a lightweight mouse from Rakk with a PAW3395 sensor and a weight of about 55 g. It has an onboard screen and multi-device support.',
    looks: 'Paper impression only: a light, compact-feeling mouse whose onboard screen sets it apart from other budget options.',
    pricePhp: { min: 1800, max: 2500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'About 55 g is very light for the price',
      'PAW3395 sensor suits competitive play',
      'Onboard screen is a useful extra, not just decoration',
      'Multi-device support',
    ],
    annoying: [
      'Costs more than the other Rakk mice here',
      'Your notes do not list the exact connection modes, so check the listing',
    ],
    insight: [
      'Your notes call it one of Rakk\'s stronger recent mice. Light weight plus a good sensor is the combination competitive players want.',
      'The screen is the part that makes it feel different. It gives quick feedback on settings without opening software.',
      'It is a good competitive budget pick, as long as you do not need a wired-only option.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A good competitive budget mouse. Confirm the connection modes in the listing.',
    bestFor: ['Competitive FPS on a budget', 'Lightweight mouse fans', 'Switching between devices'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: ['Wireless'],
    sensor: 'PAW3395',
    weightG: 55,
    features: ['Onboard screen', 'Multi-device'],
  },
  {
    kind: 'mouse',
    id: 'rakk-kala',
    brand: 'Rakk',
    name: 'Kala',
    tier: 'Budget',
    summary: 'A lightweight, claw-oriented mouse with good tracking, held back by shorter battery life.',
    description: 'The Kala is a lightweight Rakk mouse with a PAW3370 sensor and a weight of about 60 g. The shape is aimed at claw grip.',
    looks: 'Paper impression only: a small, light mouse shaped for claw grip. Check the size against your hand.',
    pricePhp: { min: 1000, max: 1500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'About 60 g with a PAW3370 sensor',
      'Good tracking',
      'Shape suits claw grip',
    ],
    annoying: [
      'Shorter battery life than the other mice here',
      'The claw-oriented shape may not suit palm grip users',
    ],
    insight: [
      'The Kala trades endurance for weight and tracking. You get good sensor performance in a light shell, and the cost is that you will charge it more often.',
      'The shape is the deciding factor. If you use a claw grip it should feel right, and if you palm the mouse it may feel too small.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Good for claw-grip players who do not mind charging often. Try the shape first if you can.',
    bestFor: ['Claw grip', 'Lightweight tracking on a budget'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: ['Wireless'],
    sensor: 'PAW3370',
    weightG: 60,
    notes: {
      shape: 'Lightweight and claw-oriented.',
      battery: 'Shorter than most mice in this list.',
    },
  },
  {
    kind: 'mouse',
    id: 'aula-x9-v9',
    brand: 'Aula',
    name: 'X9 / V9 series',
    tier: 'Budget',
    summary: 'Strong coatings and competitive performance for the price, with Ultra versions that close in on pricier mice.',
    description: 'The X9 and V9 are Aula mouse lines with a PAW3395 sensor on standard versions and a higher-end sensor on the Ultra versions. Your notes treat them as one series, so this entry does too.',
    looks: 'Paper impression only: your notes single out the coatings, so the surface finish is the thing to check in person.',
    pricePhp: { min: 1200, max: 2500, asOf: '2026-11-03', note: 'Your list gave one range for the X9 and V9 series. Ultra versions cost more.' },
    specsStatus: 'from-notes',
    good: [
      'Strong coatings',
      'Competitive performance for the price',
      'Ultra versions close the gap with more expensive mice',
    ],
    annoying: [
      'The series covers a wide price range, so versions differ a lot',
      'Your notes do not give weight or connection details',
    ],
    insight: [
      'This is a series, not a single mouse. The standard versions use a PAW3395 sensor, and the Ultra versions step up to a higher-end sensor.',
      'The value comes from performance for the money. The Ultra versions are the interesting ones because they get close to mice that cost noticeably more.',
      'Match the listing to the exact version before you buy, since specs and price vary across the range.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A good value competitive option. Check the exact version and sensor in the listing.',
    bestFor: ['Competitive play on a budget', 'Buyers who care about coating and feel'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: [],
    sensor: 'PAW3395 (higher on Ultra versions)',
  },
  {
    kind: 'mouse',
    id: 'aula-kunlun-l5',
    brand: 'Aula',
    name: 'Kunlun L5',
    tier: 'Budget',
    summary: 'A good-value competitive option, with interesting switch technology on some versions.',
    description: 'The Kunlun L5 is an Aula mouse. Your notes mention interesting switch technology on some versions and no other specs.',
    looks: 'Paper impression only: your notes give no design details, so there is nothing to say about the look until you have seen it.',
    pricePhp: { min: 1500, max: 2800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Interesting switch tech on some versions',
      'Good value for a competitive mouse',
    ],
    annoying: [
      'Switch technology differs by version',
      'Your notes do not list sensor, weight or connection details',
    ],
    insight: [
      'The Kunlun L5 is a value pick. The switch technology on some versions is the main thing that sets it apart.',
      'Versions differ, so read the listing closely to see which switches and sensor you are getting.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'A decent value option. Confirm the version, switches and sensor before ordering.',
    bestFor: ['Budget competitive play', 'Curious about newer switch tech'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Unknown',
    connectivity: [],
  },
  {
    kind: 'mouse',
    id: 'logitech-g304',
    brand: 'Logitech',
    name: 'G304 Lightspeed',
    tier: 'Budget',
    summary: 'Still one of the safest wireless recommendations. Reliable for both gaming and office use, with very long AA battery life.',
    description: 'The G304 Lightspeed is a wireless Logitech mouse with a HERO sensor up to 12,000 DPI and a weight of about 99 g. It runs on an AA battery.',
    looks: 'Paper impression only: a familiar, no-nonsense Logitech shape. Weight is on the heavier side, so check it suits your hand.',
    pricePhp: { min: 2200, max: 2800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'AA battery with very long life',
      'HERO sensor up to 12,000 DPI',
      'Works well for both gaming and office use',
      'A long-standing safe pick',
    ],
    annoying: [
      'At about 99 g it is heavy next to modern lightweight mice',
      'Uses a replaceable AA battery rather than a built-in rechargeable one',
    ],
    insight: [
      'The G304 stays on recommendation lists because it just works. The sensor is capable, the wireless is dependable and the AA battery lasts a long time.',
      'It is not a lightweight mouse by today\'s standards, so competitive players who want sub-70 g mice will look elsewhere.',
      'For someone who wants one wireless mouse for work and play with no fuss, it is hard to go wrong.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A safe wireless pick for gaming and office. Skip it if you want an ultralight mouse.',
    bestFor: ['All-round wireless use', 'Gaming and office on one mouse', 'Long battery life'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: ['Wireless'],
    sensor: 'HERO',
    dpiMax: 12000,
    weightG: 99,
    battery: 'AA (very long life)',
  },
  {
    kind: 'mouse',
    id: 'logitech-g203',
    brand: 'Logitech',
    name: 'G203 Lightsync',
    images: [{ url: 'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/refreshed-g203/2025-update/g203-mouse-top-angle-black-gallery-1.png', alt: 'Logitech G203 Lightsync product photo', credit: 'Official Logitech G product page', sourcePage: 'https://www.logitechg.com/en-us/shop/p/g203-lightsync-rgb-gaming-mouse' }],
    tier: 'Budget',
    summary: 'The classic budget RGB mouse: crisp clicks, a good sensor for the price, and a perfect first gaming mouse.',
    description: 'The G203 Lightsync is a wired Logitech mouse with an optical sensor up to 8,000 DPI and a weight of about 85 g.',
    looks: 'Paper impression only: a simple wired mouse with RGB lighting. It is a classic design, so it should be easy to find in person.',
    pricePhp: { min: 1000, max: 1400, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Crisp clicks',
      'Good sensor for the price, up to 8,000 DPI',
      'Wired, so no charging or pairing',
      'RGB at a budget price',
    ],
    annoying: [
      'Wired only',
      'About 85 g is not especially light',
    ],
    insight: [
      'This is the mouse people usually recommend as a first gaming mouse, and the notes back that up. The clicks are crisp and the sensor is more than enough for the money.',
      'Being wired is a plus for some buyers because there is no battery to think about.',
      'If you want wireless or something lighter, look at the other options on this list.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A dependable first gaming mouse at a low price.',
    bestFor: ['First gaming mouse', 'Wired reliability', 'Budget RGB'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: ['Wired'],
    sensor: 'Optical',
    dpiMax: 8000,
    weightG: 85,
    features: ['RGB'],
  },
  {
    kind: 'mouse',
    id: 'vxe-dragonfly-r1',
    brand: 'VXE',
    name: 'Dragonfly R1 / R1 SE',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0797/6334/1526/files/R1_Black.webp?v=1767515965', alt: 'VXE Dragonfly R1 product photo', credit: 'Official VXE product page; R1 shown', sourcePage: 'https://vxe.com/products/vxe-dragonfly-r1-series-wireless-mouse' }],
    tier: 'Budget',
    summary: 'Modern lightweight performance at accessible prices, with strong tracking and coating.',
    description: 'The Dragonfly R1 and R1 SE are lightweight VXE mice with a PAW3395-class sensor, often under 70 g. Your notes give one range for both, so this entry covers both.',
    looks: 'Paper impression only: your notes single out the coating, so check the finish in person.',
    pricePhp: { min: 1500, max: 2800, asOf: '2026-11-03', note: 'Your list gave one range for the R1 and R1 SE.' },
    specsStatus: 'from-notes',
    good: [
      'Often under 70 g',
      'PAW3395-class sensor with strong tracking',
      'Good coating',
      'Accessible prices for the performance',
    ],
    annoying: [
      'The two versions differ, and your notes do not say how',
      'Your notes do not list connection details',
    ],
    insight: [
      'The Dragonfly R1 gives you the modern lightweight formula at a lower price: a sensor in the PAW3395 class, low weight and a coating people like.',
      'The R1 and R1 SE are close enough that your notes cover them together, but check the listing for what separates them.',
      'It is one of the stronger picks here for competitive play on a budget.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A strong lightweight pick. Check which version a listing is.',
    bestFor: ['Competitive FPS on a budget', 'Lightweight mouse fans'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: [],
    sensor: 'PAW3395 class',
    features: ['Weight often under 70 g'],
  },
  {
    kind: 'mouse',
    id: 'attack-shark-g3-pro',
    brand: 'Attack Shark',
    name: 'G3 Pro',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0823/5050/6282/files/G3PRO_3.png?v=1777360989', alt: 'Attack Shark G3 Pro product photo', credit: 'Official Attack Shark product page', sourcePage: 'https://attackshark.com/products/attack-shark-g3-tri-mode-wireless-gaming-mouse-with-charge-dock-25000-dpi-ultra-lightweight' }],
    tier: 'Budget',
    summary: 'Feature-rich for the money, often with a charging dock, and a build that feels better than the price suggests.',
    description: 'The G3 Pro is a lightweight Attack Shark mouse that often ships with a charging dock. Your notes do not list the sensor.',
    looks: 'Paper impression only: your notes say the build feels better than expected, so the materials and finish are worth checking in person.',
    pricePhp: { min: 1000, max: 1500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Often includes a charging dock',
      'Lightweight',
      'Build feels better than expected for the price',
      'Feature-rich for the money',
    ],
    annoying: [
      'Your notes do not list the sensor or exact weight',
      'The contents of the box vary by listing, so confirm the dock is included',
    ],
    insight: [
      'The appeal is how much you get for the price: a light mouse, often with a dock, and a build that feels better than the cost suggests.',
      'Because the bundle differs between sellers, read the listing to see what is in the box.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'Good value if the listing includes the dock. Check the sensor before you order.',
    bestFor: ['Value-focused buyers', 'Lightweight wireless on a budget'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Unknown',
    connectivity: ['Wireless'],
    features: ['Often includes a charging dock', 'Lightweight'],
  },
  {
    kind: 'mouse',
    id: 'redragon-phaser-m609',
    brand: 'Redragon',
    name: 'Phaser M609',
    tier: 'Budget',
    summary: 'A basic but honest wired mouse with a decent shape for the price.',
    description: 'The Phaser M609 is a wired Redragon mouse. Your notes give no sensor or weight.',
    looks: 'Paper impression only: a basic wired gaming mouse. Your notes only mention that the shape is decent.',
    pricePhp: { min: 800, max: 1200, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Very low price',
      'Decent shape for the price',
      'Wired, so no charging',
    ],
    annoying: [
      'Basic feature set',
      'Wired only',
      'Your notes do not list the sensor or weight',
    ],
    insight: [
      'This is a no-frills mouse, and the notes describe it as honest rather than exciting. You get a decent shape and a low price.',
      'If you want a better sensor or wireless, the Logitech G203 costs only a little more.',
    ],
    score: 6.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Fine as a cheap wired mouse. Look at the G203 if you can spend slightly more.',
    bestFor: ['Tightest budgets', 'Wired setups', 'Basic gaming'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Unknown',
    connectivity: ['Wired'],
  },
  {
    kind: 'mouse',
    id: 'fantech-rhasta-ii',
    brand: 'Fantech',
    name: 'Rhasta II',
    tier: 'Budget',
    summary: 'A reliable everyday gaming mouse with good local availability and support.',
    description: 'The Rhasta II is a Fantech gaming mouse. Your notes give a shared price range and comment for it and the G13, and no spec details.',
    looks: 'Paper impression only: your notes give no design details, so there is nothing to say yet.',
    pricePhp: { min: 900, max: 1500, asOf: '2026-11-03', note: 'Your list gave one range for the Rhasta II and G13.' },
    specsStatus: 'from-notes',
    good: [
      'Good local availability',
      'Support is easy to reach',
      'Reliable for everyday gaming',
    ],
    annoying: [
      'Your notes do not list sensor, weight or connection details',
    ],
    insight: [
      'The case for Fantech here is practical. It is easy to buy locally, support is easier to deal with, and the mice are reliable for everyday gaming.',
      'It is not a spec-chasing pick, so check the listing for the sensor if performance matters to you.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A dependable local pick. Check the listing for the sensor and connection.',
    bestFor: ['Everyday gaming', 'Buyers who want easy local support'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Unknown',
    connectivity: [],
  },
  {
    kind: 'mouse',
    id: 'fantech-g13',
    brand: 'Fantech',
    name: 'G13',
    images: [{ url: 'https://fantech.ph/wp-content/uploads/2021/07/G13.png', alt: 'Fantech G13 product photo', credit: 'Fantech Philippines product image', sourcePage: 'https://fantech.ph/products/g13' }],
    tier: 'Budget',
    summary: 'A reliable everyday gaming mouse with good local availability and support.',
    description: 'The G13 is a Fantech gaming mouse. Your notes give a shared price range and comment for it and the Rhasta II, and no spec details.',
    looks: 'Paper impression only: your notes give no design details, so there is nothing to say yet.',
    pricePhp: { min: 900, max: 1500, asOf: '2026-11-03', note: 'Your list gave one range for the Rhasta II and G13.' },
    specsStatus: 'from-notes',
    good: [
      'Good local availability',
      'Support is easy to reach',
      'Reliable for everyday gaming',
    ],
    annoying: [
      'Your notes do not list sensor, weight or connection details',
    ],
    insight: [
      'Like the Rhasta II, this is a practical pick. It is easy to buy locally and reliable for everyday gaming.',
      'Your notes treat the two as one recommendation, so check the listings to see what actually separates them.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A dependable local pick. Compare it with the Rhasta II before choosing.',
    bestFor: ['Everyday gaming', 'Buyers who want easy local support'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Unknown',
    connectivity: [],
  },
  {
    kind: 'mouse',
    id: 'razer-deathadder-essential',
    brand: 'Razer',
    name: 'DeathAdder Essential',
    images: [{ url: 'https://assets2.razerzone.com/images/deathadder-essential/razer-deathadder-essential-gaming-mouse-og.jpg', alt: 'Razer DeathAdder Essential product photo', credit: 'Official Razer product page', sourcePage: 'https://www.razer.com/gaming-mice/razer-deathadder-essential' }],
    tier: 'Budget',
    summary: 'The famous DeathAdder shape in a simple, durable entry-level Razer.',
    description: 'The DeathAdder Essential is an entry-level Razer mouse with the classic ergonomic DeathAdder shape and a weight of about 96 g.',
    looks: 'Paper impression only: the classic ergonomic shape that many people already know. Check how it sits in your hand.',
    pricePhp: { min: 1200, max: 1800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Famous shape that fits many hands',
      'Simple and durable',
      'An easy way into the Razer lineup',
    ],
    annoying: [
      'About 96 g is heavy next to modern lightweight mice',
      'Basic features, and your notes list no sensor or connection details',
    ],
    insight: [
      'The shape is the reason to buy. It is one of the best-known ergonomic designs, and it suits a lot of hand sizes.',
      'It is a simple mouse. You are paying for the shape and durability, not for modern features or low weight.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Good if you already like the DeathAdder shape. Better value elsewhere if you just want specs.',
    bestFor: ['Palm and relaxed grip users', 'Anyone who likes the classic shape', 'Durable entry mouse'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Unknown',
    connectivity: [],
    weightG: 96,
    shape: 'Classic ergonomic',
  },

  // ======================= MID-RANGE =======================
  {
    kind: 'mouse',
    id: 'logitech-ergo-m575s',
    brand: 'Logitech',
    name: 'ERGO M575S',
    tier: 'Mid-range',
    summary: 'A solid budget trackball that reduces wrist movement, though fine work takes some practice.',
    description: 'The ERGO M575S is a Logitech trackball with Bluetooth and 2.4 GHz connectivity. You move the ball with your thumb, so the mouse itself stays still.',
    looks: 'Paper impression only: a trackball, so the shape is very different from a regular mouse. Try one in a shop if you can.',
    pricePhp: { min: 2500, max: 3500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Reduces wrist movement',
      'Bluetooth and 2.4 GHz connectivity',
      'Solid budget trackball',
    ],
    annoying: [
      'Less precise for some fine work until you get used to it',
      'Trackballs take time to adjust to if you are used to a mouse',
    ],
    insight: [
      'The point of a trackball is comfort. You move your thumb instead of your whole arm, which can help if wrist movement bothers you.',
      'Fine detail work, like precise selections or editing, can feel less accurate until you have practiced.',
      'It is not a gaming mouse. Think of it as an office and comfort pick.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A good low-cost way to try a trackball. Expect a learning curve.',
    bestFor: ['Reducing wrist movement', 'Office use', 'Small desks'],
    updated: '2026-11-03',
    formFactor: 'Trackball',
    sensorType: 'Unknown',
    connectivity: ['Bluetooth', '2.4 GHz'],
  },

  // ======================= PREMIUM =======================
  {
    kind: 'mouse',
    id: 'logitech-mx-master-4',
    brand: 'Logitech',
    name: 'MX Master 4',
    images: [{ url: 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-4/gallery/mx-master-4-graphite-top-angle-gallery-1.png', alt: 'Logitech MX Master 4 product photo', credit: 'Official Logitech product page', sourcePage: 'https://www.logitech.com/en-us/shop/p/mx-master-4' }],
    tier: 'Premium',
    summary: 'Still the productivity reference, with dual scroll wheels, haptics and gesture controls. Excellent for office and creative work, not for competitive FPS.',
    description: 'The MX Master 4 is a Logitech productivity mouse with a Darkfield sensor up to 8,000 DPI, dual scroll wheels, haptics and gesture controls. It weighs about 150 g and has up to 70 days of battery life.',
    looks: 'Paper impression only: a large, sculpted productivity mouse. At about 150 g it is a heavy mouse, so the size and weight are worth checking in person.',
    pricePhp: { min: 6500, max: 8000, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Dual scroll wheels',
      'Haptics and gesture controls',
      'Battery life of up to 70 days',
      'Darkfield sensor up to 8,000 DPI',
    ],
    annoying: [
      'About 150 g is far too heavy for competitive FPS',
      'High price',
      'Your notes do not list connection details',
    ],
    insight: [
      'The MX Master 4 is what other productivity mice are compared against. The dual scroll wheels, haptics and gestures are built for people who spend long hours on documents, spreadsheets and creative software.',
      'It is not aimed at competitive FPS. The weight and the feature set point firmly at office and creative work.',
      'The battery life is a practical advantage, since you are unlikely to think about charging for weeks.',
    ],
    score: 8.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Excellent for office and creative work. The price is the only real hurdle, and it is not a gaming mouse.',
    bestFor: ['Office and productivity', 'Creative work', 'Long battery life'],
    updated: '2026-11-03',
    formFactor: 'Mouse',
    sensorType: 'Optical',
    connectivity: [],
    sensor: 'Darkfield',
    dpiMax: 8000,
    weightG: 150,
    battery: 'Up to 70 days',
    features: ['Dual scroll wheels', 'Haptics', 'Gesture controls'],
  },
  {
    kind: 'mouse',
    id: 'logitech-mx-ergo-s',
    brand: 'Logitech',
    name: 'MX Ergo S',
    images: [{ url: 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-ergo-s-wireless-trackball-mouse/gallery/mx-ergo-s-graphite-gallery-1.png', alt: 'Logitech MX Ergo S product photo', credit: 'Official Logitech product page', sourcePage: 'https://www.logitech.com/en-us/shop/p/mx-ergo-s-wireless-trackball-mouse' }],
    tier: 'Premium',
    summary: 'A higher-end trackball with a tilt adjustment and better comfort for long sessions.',
    description: 'The MX Ergo S is a Logitech trackball with a tilt adjustment. Your notes position it as the higher-end step above the ERGO M575S.',
    looks: 'Paper impression only: a trackball with an adjustable tilt, so the angle can be set to your preference.',
    pricePhp: { min: 5500, max: 7000, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Tilt adjustment',
      'Better comfort for long sessions',
      'More adjustable than the M575S',
    ],
    annoying: [
      'Costs about twice as much as the M575S',
      'Your notes do not list sensor, weight or connection details',
    ],
    insight: [
      'The MX Ergo S is the trackball for people who spend long hours at a desk and want to fine-tune the angle. The tilt is the main upgrade over cheaper trackballs.',
      'Whether it is worth the extra money depends on how much you use it. If you want to try a trackball first, the M575S costs much less.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'For long sessions and comfort-first users. Try the M575S first if you are unsure about trackballs.',
    bestFor: ['Long sessions', 'Comfort-first users', 'Adjustable angle'],
    updated: '2026-11-03',
    formFactor: 'Trackball',
    sensorType: 'Unknown',
    connectivity: [],
    features: ['Tilt adjustment'],
  },
];
