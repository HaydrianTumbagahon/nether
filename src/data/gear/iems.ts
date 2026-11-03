// ---------- TYPES (kept in this file so it stands alone) ----------
type Tier = 'Budget' | 'Mid-range' | 'Premium';
type Verdict = 'Buy' | 'Buy on sale';
type SpecsStatus = 'verified' | 'from-notes';
type PricePhp = { min: number; max: number; asOf: string; note?: string };
type ProductImage = { url: string; alt: string; credit: string; sourcePage: string };
type Brand = { slug: string; name: string; country?: string; blurb: string; url?: string };

export interface FrequencyGraph {
  url: string;        // remote image URL only, no downloads
  source: string;     // e.g. 'Squig.link'
  sourcePage: string; // the page the graph came from
  note?: string;
}

export interface IEM {
  kind: 'iem';
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
  graphs?: FrequencyGraph[];

  // Filter: type. 'Unknown' means the notes did not say.
  driverConfig: '1DD' | '2DD' | 'Planar' | 'Hybrid' | 'Unknown';

  // Specs (all optional because notes do not always list them)
  driver?: string;
  driverSizeMm?: number;
  impedanceOhm?: number;
  sensitivityDb?: number;
  shell?: string;
  cable?: string;
  connector?: string;
  features?: string[];

  // Short sound tags taken from the wording of the notes, not measurements
  signature?: string[];

  notes?: {
    sound?: string;
    fit?: string;
    accessories?: string;
    mods?: string;
  };
}

// HOW TO READ THIS FILE
// - specsStatus 'from-notes': every spec here comes only from your notes. None of it has been checked against manufacturer or retailer pages yet.
//   The UI should show a badge. Change an entry to 'verified' once you have checked it.
// - pricePhp: typical street price from YOUR list, not checked at Shopee or Lazada. Show as "about", and tell readers to check the store.
//   Where one range covers two versions, the note says so.
// - driverConfig 'Unknown' or a missing spec means your notes did not say. Fill these in before relying on the sort and filter.
// - signature: short sound tags taken from the wording of your notes (bass-focused, balanced, warm and so on). They are not measurements.
// - description / looks / insight: written from your notes only. `looks` is a paper impression, not something I handled. Edit it after you have seen the set.
// - Scores and verdicts are PAPER scores (handsOn: false). Change any number freely. Set handsOn: true only for sets you have used.
// - No images or graphs yet: add `images: [{ url, alt, credit, sourcePage }]` and
//   `graphs: [{ url, source, sourcePage }]` (Squig.link first) with remote URLs only, after you have found the right ones.

export const iemBrands: Brand[] = [
  { slug: 'qkz', name: 'QKZ', country: 'China', blurb: 'Budget IEM brand known for bass-forward, low-priced sets and collaborations like the QKZ x HBB.' },
  { slug: 'tangzu', name: 'Tangzu', country: 'China', blurb: 'Brand with an accessible, musical tuning style, best known here for the Wan’er SG2 line.' },
  { slug: '7hz', name: '7Hz', country: 'China', blurb: 'Brand that popularized good tuning at very low prices with the Salnotes Zero, and has worked with Crinacle on the Zero:2 and Diablo.' },
  { slug: 'blon', name: 'Blon', country: 'China', blurb: 'Maker of the BL-03, a classic V-shaped budget set that many users tip-roll and cable-roll.' },
  { slug: 'truthear', name: 'Truthear', country: 'China', blurb: 'Brand known for measured, target-oriented tuning, from the original Zero to the newer Gate.' },
  { slug: 'simgot', name: 'Simgot', country: 'China', blurb: 'Brand with a cleaner, more detailed presentation, from the EW200 up to higher-configuration sets like the EM6L.' },
  { slug: 'tanchjim', name: 'Tanchjim', country: 'China', blurb: 'Brand known for refined, coherent tuning with a strong midrange and smooth, non-fatiguing sound.' },
  { slug: 'moondrop', name: 'Moondrop', country: 'China', blurb: 'Brand behind the Chu II, the current consensus "safe first IEM", and step-up sets like the Aria and Stellaris.' },
  { slug: 'kiwi-ears', name: 'Kiwi Ears', country: 'China', blurb: 'Brand known for natural, musical tuning, including the beryllium-driver Cadenza.' },
];

export const iems: IEM[] = [
  // ======================= BUDGET =======================
  {
    kind: 'iem',
    id: 'qkz-x-hbb',
    brand: 'QKZ',
    name: 'x HBB',
    tier: 'Budget',
    summary: 'A bass-focused collaboration set that is fun and energetic for the price.',
    description: 'The QKZ x HBB is a dynamic-driver IEM made in collaboration with HBB. Your notes describe it as bass-focused and energetic.',
    looks: 'Paper impression only: your notes give no design details, so check the shell and finish once you have seen it.',
    pricePhp: { min: 1000, max: 1600, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Bass-focused tuning that is fun and energetic',
      'Low price for a collaboration set',
    ],
    annoying: [
      'Bass-forward sets are not for listeners who want a neutral sound',
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'This is a fun set rather than an accurate one. The notes describe it as energetic and bass-focused, and at this price that is the point.',
      'If you want something more balanced, the 7Hz and Moondrop sets lower down this list are the safer picks.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A cheap, fun bass set. Skip it if you want a neutral sound.',
    bestFor: ['Bass lovers on a budget', 'Casual and fun listening', 'EDM and hip-hop'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: 'Dynamic',
    signature: ['Bass-focused', 'Fun', 'Energetic'],
  },
  {
    kind: 'iem',
    id: 'qkz-castor-pro-bass',
    brand: 'QKZ',
    name: 'Castor Pro Bass',
    tier: 'Budget',
    summary: 'Strong bass with flexibility from tuning switches. An excellent value dual-driver set.',
    description: 'The Castor Pro Bass uses dual 10 mm dynamic drivers and has tuning switches so you can change the sound.',
    looks: 'Paper impression only: your notes mention tuning switches, so check where they sit on the shell.',
    pricePhp: { min: 1200, max: 1800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Strong bass',
      'Tuning switches give you some control over the sound',
      'Dual 10 mm dynamic drivers at a low price',
    ],
    annoying: [
      'Strong bass will not suit every listener',
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'The switches are what make this interesting. You get strong bass out of the box and some flexibility to adjust it, which is rare at this price.',
      'Your notes call it an excellent value dual-driver set, and the combination of two dynamic drivers and switches backs that up.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'Great value if you like bass and want to tweak it. Not a neutral reference set.',
    bestFor: ['Bass lovers', 'People who want adjustable tuning', 'Budget dual-driver sets'],
    updated: '2026-11-03',
    driverConfig: '2DD',
    driver: 'Dual 10 mm dynamic',
    driverSizeMm: 10,
    signature: ['Bass-focused'],
    features: ['Tuning switches'],
  },
  {
    kind: 'iem',
    id: 'qkz-ak6-pro',
    brand: 'QKZ',
    name: 'AK6 Pro',
    tier: 'Budget',
    summary: 'A noticeable upgrade from the basic AK6, warmer and more controlled than the ultra-cheap original.',
    description: 'The AK6 Pro is a QKZ IEM with an 11 mm dynamic driver. It is an upgrade over the basic AK6.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 800, max: 1300, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Warmer and more controlled than the original AK6',
      '11 mm dynamic driver',
      'Very low price',
    ],
    annoying: [
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'The main point is the improvement over the basic AK6. It sounds warmer and more controlled than the ultra-cheap original.',
      'It is a good pick if you want to spend very little and still get a step up from the cheapest sets.',
    ],
    score: 6.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'A cheap upgrade over the original AK6. The Moondrop Chu II is a safer first IEM for a little more.',
    bestFor: ['Tight budgets', 'A warm, controlled sound', 'Upgrading from the basic AK6'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: '11 mm dynamic',
    driverSizeMm: 11,
    signature: ['Warm', 'Controlled'],
  },
  {
    kind: 'iem',
    id: 'tangzu-waner-sg2',
    brand: 'Tangzu',
    name: 'Wan’er SG2',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/IMG_0892.jpg?v=1743127435', alt: 'Tangzu Wan’er SG II product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/tangzu-waner-s-g-ii' }],
    tier: 'Budget',
    summary: 'Musical and engaging, and one of the best "fun but still good" budget sets.',
    description: 'The Wan’er SG2 is a Tangzu IEM with a 10 mm PET dynamic driver and an impedance of about 20 Ω.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1200, max: 1600, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Musical and engaging tuning',
      '10 mm PET dynamic driver',
      'Described as one of the best fun-but-good budget sets',
    ],
    annoying: [
      'A fun, musical tuning is not the same as a neutral one',
      'Your notes do not list shell or cable details',
    ],
    insight: [
      'The SG2 is the kind of set people recommend when they want something enjoyable rather than analytical. It stays good while being fun.',
      'The impedance is about 20 Ω, which should be easy to drive from a phone or a dongle.',
      'If you want a bassier version, the Red Lion below adds that.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A very good budget pick for musical, engaging listening.',
    bestFor: ['Musical and engaging listening', 'Beginners who want something fun', 'Phone and dongle use'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: '10 mm PET dynamic',
    driverSizeMm: 10,
    impedanceOhm: 20,
    signature: ['Musical', 'Engaging'],
  },
  {
    kind: 'iem',
    id: 'tangzu-waner-sg2-red-lion',
    brand: 'Tangzu',
    name: 'Wan’er SG2 Red Lion',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/20260129022108_397_251.jpg?v=1769742393', alt: 'Tangzu Wan’er SG II Bass Version Lion Edition product photo', credit: 'Linsoul product page; Lion Edition shown', sourcePage: 'https://www.linsoul.com/products/tangzu-wan-er-s-g-ii-bass-version-lion-edition' }],
    tier: 'Budget',
    summary: 'Adds satisfying bass while keeping the musical character of the SG2, with generous accessories.',
    description: 'The Wan’er SG2 Red Lion is a version of the SG2 with a 10 mm PET dynamic driver. Your notes say it adds bass and comes with generous accessories.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1300, max: 1700, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Satisfying bass while keeping the musical character',
      'Generous accessories',
    ],
    annoying: [
      'Costs a little more than the standard SG2',
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'This is the SG2 for people who want more bass. It keeps the musical tuning and adds impact.',
      'The accessories are a nice bonus at this price, which helps with tip and cable choices.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'Pick this over the standard SG2 if you want more bass. Otherwise the standard version is fine.',
    bestFor: ['Bass with a musical tuning', 'Buyers who like extras in the box'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: '10 mm PET dynamic',
    driverSizeMm: 10,
    signature: ['Musical', 'Bass-forward'],
    notes: {
      accessories: 'Generous accessories in the box.',
    },
  },
  {
    kind: 'iem',
    id: 'tangzu-he-xiaoqiao',
    brand: 'Tangzu',
    name: 'He Xiaoqiao',
    tier: 'Budget',
    summary: 'Fits Tangzu’s accessible and musical tuning style.',
    description: 'The He Xiaoqiao is a Tangzu IEM. Your notes say it fits the brand’s accessible, musical tuning style and give no other specs.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1500, max: 2200, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Accessible and musical tuning in the Tangzu style',
    ],
    annoying: [
      'Your notes do not list driver, impedance or shell details',
      'Not much detail to go on beyond the brand style',
    ],
    insight: [
      'This is a brand-consistent set. If you like the Tangzu approach from the SG2, this should feel familiar.',
      'Check the listing for driver and specs before buying, since your notes are thin here.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'A reasonable Tangzu option, but the SG2 is the better-documented choice.',
    bestFor: ['Fans of Tangzu’s musical style'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Musical', 'Accessible'],
  },
  {
    kind: 'iem',
    id: '7hz-salnotes-zero',
    brand: '7Hz',
    name: 'Salnotes Zero',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/products/1_5_76abebe9-16ab-44c6-b17d-25a941c8f96e.jpg?v=1658260060', alt: '7Hz Salnotes Zero product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/7hz-salnotes-zero' }],
    tier: 'Budget',
    summary: 'The set that popularized good tuning at very low prices. Clean and balanced.',
    description: 'The Salnotes Zero is a dynamic-driver IEM from 7Hz. Your notes credit it with popularizing good tuning at very low prices.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1000, max: 1400, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Clean and balanced sound',
      'Very low price',
      'Helped set the standard for budget tuning',
    ],
    annoying: [
      'Newer sets like the Zero:2 improve on it',
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'This is the set that showed cheap IEMs could be tuned well. Clean and balanced is the headline.',
      'The Zero:2 is the next step if you want better bass, and it costs only a little more.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A clean, balanced starter set. Consider the Zero:2 for a bit more.',
    bestFor: ['First IEM', 'Balanced listening', 'Very small budgets'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: 'Dynamic',
    signature: ['Clean', 'Balanced'],
  },
  {
    kind: 'iem',
    id: '7hz-zero-2',
    brand: '7Hz',
    name: 'Zero:2 (Crinacle)',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/203A4941_1_7561cf09-026c-4fe6-958d-1c7b5ee37a4f.jpg?v=1739258197', alt: '7Hz x Crinacle Zero:2 product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/7hz-x-crinacle-zero-2' }],
    tier: 'Budget',
    summary: 'Warm-neutral with better bass than the original. Extremely popular and a safe recommendation.',
    description: 'The Zero:2 is a collaboration between 7Hz and Crinacle. It uses a 10 mm dual-cavity dynamic driver and has an impedance of 32 Ω.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1400, max: 1800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Warm-neutral tuning',
      'Better bass than the original Salnotes Zero',
      '10 mm dual-cavity dynamic driver',
      'Extremely popular and a safe recommendation',
    ],
    annoying: [
      'A safe pick means it is not a standout for bass lovers or detail hunters',
    ],
    insight: [
      'The Zero:2 is the safe choice. It builds on the original by improving the bass while staying warm-neutral.',
      'At 32 Ω it should be easy to drive from most phones and dongles.',
      'Your notes call it extremely popular, which is useful if you want reviews and community help.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A safe, popular budget recommendation.',
    bestFor: ['First IEM', 'Warm-neutral listening', 'Safe, well-reviewed pick'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: '10 mm dual-cavity dynamic',
    driverSizeMm: 10,
    impedanceOhm: 32,
    signature: ['Warm-neutral'],
  },
  {
    kind: 'iem',
    id: 'blon-bl-03',
    brand: 'Blon',
    name: 'BL-03',
    tier: 'Budget',
    summary: 'Classic V-shaped fun with bass as the star. Most users tip-roll and cable-roll.',
    description: 'The BL-03 is a Blon IEM with a dynamic driver and a metal shell. Your notes describe it as a classic V-shaped set.',
    looks: 'Paper impression only: the shell is metal, which your notes mention. Check the build and finish in person.',
    pricePhp: { min: 900, max: 1400, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Classic V-shaped fun',
      'Bass is the star',
      'Metal shell',
    ],
    annoying: [
      'Most users end up tip-rolling and cable-rolling to get the sound they want',
      'V-shaped tuning is not neutral',
    ],
    insight: [
      'The BL-03 is a classic for a reason: it is fun, bassy and cheap. Your notes say bass is the star.',
      'Many owners swap tips and cables, so budget a little extra if you want to fine-tune it.',
      'For a more balanced sound at the same price, look at the 7Hz sets.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Fun and bassy, but expect to experiment with tips and cables.',
    bestFor: ['Bass lovers', 'Tinkerers who like swapping tips and cables', 'Fun listening'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: 'Dynamic',
    shell: 'Metal',
    signature: ['V-shaped', 'Bass-focused', 'Fun'],
    notes: {
      mods: 'Most users tip-roll and cable-roll.',
    },
  },
  {
    kind: 'iem',
    id: 'simgot-ew200',
    brand: 'Simgot',
    name: 'EW200',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/IMG_0638_24bd932f-a8cf-41e9-901a-399558a191c2.jpg?v=1685678212', alt: 'Simgot EW200 product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/simgot-ew200' }],
    tier: 'Budget',
    summary: 'A cleaner and more detailed presentation than most sets at the price.',
    description: 'The EW200 is a Simgot IEM. Your notes describe a cleaner and more detailed presentation and give no other specs.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1500, max: 2200, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Cleaner and more detailed presentation',
    ],
    annoying: [
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'The EW200 is for people who want clarity and detail more than heavy bass.',
      'The EW300 is the step up if you want more refinement.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A good choice if you want a cleaner, more detailed sound. Check the specs in the listing.',
    bestFor: ['Detail and clarity', 'People moving up from basic sets'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Clean', 'Detailed'],
  },
  {
    kind: 'iem',
    id: 'tanchjim-bunny',
    brand: 'Tanchjim',
    name: 'Bunny / Bunny G',
    tier: 'Budget',
    summary: 'Smooth and non-fatiguing, and excellent for long listening and vocals.',
    description: 'The Bunny and Bunny G are Tanchjim IEMs. Your notes treat them as one entry, so this one does too.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1500, max: 2500, asOf: '2026-11-03', note: 'Your list gave one range for the Bunny and Bunny G.' },
    specsStatus: 'from-notes',
    good: [
      'Smooth and non-fatiguing',
      'Excellent for long listening sessions',
      'Good with vocals',
    ],
    annoying: [
      'Your notes do not say how the Bunny and Bunny G differ',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'These are comfort-first IEMs. The smooth tuning makes them easy to wear for hours.',
      'Vocals are a highlight, which suits pop, acoustic and podcasts.',
      'Check the listing to see which version you are getting.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A great choice for long, relaxed listening and vocals.',
    bestFor: ['Long listening sessions', 'Vocals', 'Treble-sensitive listeners'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Smooth', 'Non-fatiguing'],
  },
  {
    kind: 'iem',
    id: 'moondrop-chu',
    brand: 'Moondrop',
    name: 'Chu',
    tier: 'Budget',
    summary: 'An older but still capable ultra-budget option.',
    description: 'The Chu is a Moondrop IEM that your notes call an older but still capable ultra-budget option.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 900, max: 1300, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Still capable for the price',
      'Very low price',
    ],
    annoying: [
      'It is the older model, and the Chu II has since replaced it as the safe pick',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'The Chu is still a reasonable buy at the lowest budgets.',
      'For only a little more, the Chu II is the current consensus first IEM, so compare prices before choosing.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Fine if it is much cheaper than the Chu II. Otherwise buy the Chu II.',
    bestFor: ['Ultra-low budgets'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Capable'],
  },
  {
    kind: 'iem',
    id: 'moondrop-chu-ii',
    brand: 'Moondrop',
    name: 'Chu II',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/5_2f49efbf-6c26-47eb-b6ad-795661381cbb.jpg?v=1689072074', alt: 'Moondrop Chu II product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/moondrop-chu-ii' }],
    tier: 'Budget',
    summary: 'The current consensus "safe first IEM": clean, balanced and non-fatiguing.',
    description: 'The Chu II is a Moondrop IEM with a 10 mm dynamic driver and a metal shell.',
    looks: 'Paper impression only: the shell is metal, which your notes mention. Check the finish in person.',
    pricePhp: { min: 1100, max: 1400, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Clean and balanced sound',
      'Non-fatiguing',
      'Metal shell',
      'Consensus safe first IEM',
    ],
    annoying: [
      'A safe, balanced tuning will not excite bass lovers',
      'Your notes do not list impedance or cable details',
    ],
    insight: [
      'The Chu II is the set people point to when someone asks for a first IEM. It is clean, balanced and easy on the ears.',
      'The price is low enough that it is hard to regret.',
      'If you later want more refinement, the Aria is the step up from the same brand.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'The safe first IEM. A good place to start if you are not sure what you like.',
    bestFor: ['First IEM', 'Balanced everyday listening', 'Long sessions'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: '10 mm dynamic',
    driverSizeMm: 10,
    shell: 'Metal',
    signature: ['Clean', 'Balanced', 'Non-fatiguing'],
  },
  {
    kind: 'iem',
    id: 'kiwi-ears-cadenza',
    brand: 'Kiwi Ears',
    name: 'Cadenza',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/products/KiwiEarsCadenza-1.jpg?v=1682301225', alt: 'Kiwi Ears Cadenza product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/kiwi-ears-cadenza' }],
    tier: 'Budget',
    summary: 'Natural and musical with a strong midrange, and a big step up in refinement for many users.',
    description: 'The Cadenza is a Kiwi Ears IEM with a 10 mm beryllium dynamic driver.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 1800, max: 2500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Natural and musical sound',
      'Strong midrange',
      '10 mm beryllium dynamic driver',
      'A big step up in refinement for many users',
    ],
    annoying: [
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'The Cadenza is the pick if you want your first jump in refinement. It sounds natural and musical, and the midrange is a strength.',
      'A beryllium driver at this price is one of its selling points.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A strong step up from the cheapest sets, especially if you like vocals and mids.',
    bestFor: ['Natural, musical listening', 'Vocals and midrange', 'Stepping up from entry-level sets'],
    updated: '2026-11-03',
    driverConfig: '1DD',
    driver: '10 mm beryllium dynamic',
    driverSizeMm: 10,
    signature: ['Natural', 'Musical', 'Strong midrange'],
  },

  // ======================= MID-RANGE =======================
  {
    kind: 'iem',
    id: 'truthear-zero',
    brand: 'Truthear',
    name: 'Zero',
    tier: 'Mid-range',
    summary: 'Measured, target-oriented tuning that is clean and balanced.',
    description: 'The Zero is a Truthear IEM with measured, target-oriented tuning. Your notes give no driver details.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 2800, max: 3500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Measured, target-oriented tuning',
      'Clean and balanced sound',
    ],
    annoying: [
      'Costs more than the budget sets that are also balanced',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'The Zero is aimed at people who want a tuning that follows a target rather than a fun sound.',
      'Compare it with the Moondrop Chu II and 7Hz Zero:2 first, since they are cheaper and also balanced.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'A good balanced set, but cheaper options cover similar ground.',
    bestFor: ['Target-oriented tuning', 'Balanced listening'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Clean', 'Balanced', 'Target-oriented'],
  },
  {
    kind: 'iem',
    id: 'truthear-zero-red',
    brand: 'Truthear',
    name: 'Zero:Red',
    tier: 'Mid-range',
    summary: 'A warmer, bassier version of the Zero.',
    description: 'The Zero:Red is a warmer and bassier version of the Truthear Zero. Your notes give no driver details.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 3000, max: 3800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Warmer, bassier take on the Zero',
    ],
    annoying: [
      'Costs more than the standard Zero',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'Choose this over the Zero if you want more warmth and bass.',
      'If you prefer a neutral balance, the standard Zero is the better match.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'For listeners who want the Zero with more warmth and bass.',
    bestFor: ['Warm, bassier listening'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Warm', 'Bassy'],
  },
  {
    kind: 'iem',
    id: 'truthear-zero-blue-2',
    brand: 'Truthear',
    name: 'Zero:Blue 2',
    tier: 'Mid-range',
    summary: 'A refined take on the Zero formula.',
    description: 'The Zero:Blue 2 is a refined take on the Truthear Zero formula. Your notes give no driver details.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 3500, max: 4200, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Refined version of the Zero formula',
    ],
    annoying: [
      'Higher price than the other Zero models',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'This is the most refined of the Zero line in your notes.',
      'Whether the extra cost is worth it depends on how much refinement matters to you.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'For listeners who liked the Zero formula and want more refinement. Check the exact specs in the listing.',
    bestFor: ['Upgrading within the Truthear Zero line'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Refined'],
  },
  {
    kind: 'iem',
    id: 'truthear-gate',
    brand: 'Truthear',
    name: 'Gate',
    tier: 'Mid-range',
    summary: 'An accessible newer option from Truthear.',
    description: 'The Gate is a newer Truthear IEM. Your notes describe it as accessible and give no other specs.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 2000, max: 3000, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Accessible newer option from the brand',
    ],
    annoying: [
      'Your notes give almost no detail',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'Your notes are thin on the Gate, so treat this as a placeholder until you add more details.',
      'It sits below the Zero models in price within the Truthear range.',
    ],
    score: 7,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'Worth a look if you like Truthear. Check specs in the listing first.',
    bestFor: ['Entering the Truthear lineup'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Accessible'],
  },
  {
    kind: 'iem',
    id: 'simgot-ew300',
    brand: 'Simgot',
    name: 'EW300',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/IMG_5514.jpg?v=1770789342', alt: 'Simgot EW300 product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/simgot-ew300' }],
    tier: 'Mid-range',
    summary: 'A step up in refinement from the EW200.',
    description: 'The EW300 is a Simgot IEM that your notes describe as a step up in refinement from the EW200.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 2200, max: 2800, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'More refined than the EW200',
    ],
    annoying: [
      'Costs more than the EW200',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'This is the next step from the EW200 within Simgot’s range.',
      'The EW200 is the cheaper entry if you do not need the extra refinement.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy',
    verdictLine: 'A sensible step up from the EW200. Check specs in the listing.',
    bestFor: ['Stepping up from the EW200', 'Refinement'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Refined', 'Clean'],
  },
  {
    kind: 'iem',
    id: 'simgot-em6l',
    brand: 'Simgot',
    name: 'EM6L',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/IMG_8971_611f8d78-f845-4d75-808c-074811cc4af8.jpg?v=1690614787', alt: 'Simgot EM6L product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/simgot-em6l' }],
    tier: 'Mid-range',
    summary: 'A higher-configuration set with better technical performance.',
    description: 'The EM6L is a Simgot IEM with a higher driver configuration than the EW models, according to your notes. It gives no other specs.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 4000, max: 5500, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Better technical performance',
      'Higher configuration than the cheaper Simgot sets',
    ],
    annoying: [
      'Priced well above the EW models',
      'Your notes do not list the exact driver setup, impedance or shell',
    ],
    insight: [
      'The EM6L is where Simgot moves from cleaner and more detailed to more technically capable.',
      'Check the listing for the actual driver configuration, since your notes only say it is higher.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'For listeners who want more technical performance than the EW models. Confirm the specs first.',
    bestFor: ['Technical performance', 'Moving up from budget sets'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Technical'],
  },
  {
    kind: 'iem',
    id: 'tanchjim-kaiser',
    brand: 'Tanchjim',
    name: 'Kaiser',
    tier: 'Mid-range',
    summary: 'Refined and coherent, with a strong midrange.',
    description: 'The Kaiser is a Tanchjim IEM. Your notes describe it as refined and coherent with a strong midrange.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 3500, max: 5000, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Refined and coherent sound',
      'Strong midrange',
    ],
    annoying: [
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'The Kaiser fits Tanchjim’s refined, coherent style. The midrange is the strength.',
      'A strong midrange makes it a good fit for vocals.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'For listeners who care about midrange and coherence. Check specs in the listing.',
    bestFor: ['Vocals and midrange', 'Coherent, refined listening'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Refined', 'Coherent', 'Strong midrange'],
  },
  {
    kind: 'iem',
    id: 'moondrop-aria',
    brand: 'Moondrop',
    name: 'Aria / Aria SE',
    tier: 'Mid-range',
    summary: 'A noticeable jump in refinement and resolution over Chu-level sets.',
    description: 'The Aria and Aria SE are Moondrop IEMs. Your notes treat them as one entry, so this one does too.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 3500, max: 5000, asOf: '2026-11-03', note: 'Your list gave one range for the Aria and Aria SE.' },
    specsStatus: 'from-notes',
    good: [
      'Noticeable jump in refinement over the Chu line',
      'Better resolution than Chu-level sets',
    ],
    annoying: [
      'Costs several times as much as the Chu II',
      'Your notes do not say how the Aria and Aria SE differ',
      'Your notes do not list driver, impedance or shell details',
    ],
    insight: [
      'The Aria is the step up from the Chu line, with better refinement and resolution.',
      'Whether the jump is worth the money depends on how much you care about detail.',
      'Check the listing to see which version you are getting.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'A good upgrade from a Chu. Not needed if you are happy with the Chu II.',
    bestFor: ['Upgrading from a Chu', 'Refinement and resolution'],
    updated: '2026-11-03',
    driverConfig: 'Unknown',
    signature: ['Refined', 'Resolving'],
  },

  // ======================= PREMIUM =======================
  {
    kind: 'iem',
    id: '7hz-diablo',
    brand: '7Hz',
    name: 'Diablo (Crinacle)',
    images: [{ url: 'https://cdn.shopify.com/s/files/1/0040/7201/3924/files/7HZDiablo_2.jpg?v=1762329995', alt: '7Hz x Crinacle Diablo product photo', credit: 'Linsoul product page', sourcePage: 'https://www.linsoul.com/products/7hz-x-crinacle-diablo' }],
    tier: 'Premium',
    summary: 'A basshead-oriented planar with strong impact and resolution for the price.',
    description: 'The Diablo is a collaboration between 7Hz and Crinacle. It uses a 14.5 mm planar driver and is aimed at bass lovers.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 8000, max: 10000, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Strong bass impact',
      'Good resolution for the price',
      '14.5 mm planar driver',
    ],
    annoying: [
      'Basshead tuning is not for everyone',
      'Highest price in this list',
      'Your notes do not list impedance, shell or cable details',
    ],
    insight: [
      'The Diablo is for people who want bass with the speed and resolution of a planar driver.',
      'It costs far more than the other sets here, so it only makes sense if you already know you want this sound.',
    ],
    score: 8,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'A strong basshead planar if you can afford it. Not a first IEM.',
    bestFor: ['Bassheads', 'Planar fans', 'Listeners with some experience'],
    updated: '2026-11-03',
    driverConfig: 'Planar',
    driver: '14.5 mm planar',
    driverSizeMm: 14.5,
    signature: ['Bass-focused', 'Resolving'],
  },
  {
    kind: 'iem',
    id: 'moondrop-stellaris',
    brand: 'Moondrop',
    name: 'Stellaris',
    tier: 'Premium',
    summary: 'A planar option with a different technical character from the dynamic-driver sets.',
    description: 'The Stellaris is a planar IEM from Moondrop. Your notes say it has a different technical character and give no other specs.',
    looks: 'Paper impression only: your notes give no design details.',
    pricePhp: { min: 5000, max: 7000, asOf: '2026-11-03' },
    specsStatus: 'from-notes',
    good: [
      'Planar driver with a different technical character',
    ],
    annoying: [
      'Higher price than most sets here',
      'Your notes do not list driver size, impedance or shell details',
    ],
    insight: [
      'The Stellaris is for people who want to hear what a planar sounds like within the Moondrop range.',
      'Your notes are brief, so check the listing for specs before you buy.',
    ],
    score: 7.5,
    handsOn: false,
    verdict: 'Buy on sale',
    verdictLine: 'An interesting planar from Moondrop for experienced buyers.',
    bestFor: ['Planar curious', 'Listeners who want a different technical character'],
    updated: '2026-11-03',
    driverConfig: 'Planar',
    driver: 'Planar',
    signature: ['Technical'],
  },
];
