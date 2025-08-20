// data/sampleProducts.ts

export type ColorOption = {
  id: string;
  name: string;
  hex?: string; // optional hex color for UI swatch
  available?: boolean;
};

export type ProductItem = {
  id: string;
  name: string;
  price: number; // USD (number)
  description?: string;
  images: (string | { uri: string })[]; // remote URIs (string) or local require(...) object
  category?: string;
  rating?: number; // 0..5
  sku?: string;
  stock?: number; // available units
  // UI-specific fields
  colors?: ColorOption[]; // choose color
  defaultColorId?: string | null;
  noiseOptions?: string[]; // e.g. ['ANC','None']
  defaultNoiseOption?: string | null;
  productInformation?: string; // longer HTML/text block
  shippingAndReturn?: string;
  specs?: Record<string, string | number>; // key-value specs
};

export const sampleProducts: ProductItem[] = [
  {
    id: '1',
    name: 'Aurora Wireless Headphones',
    price: 299.0,
    description:
      'Premium over-ear wireless headphones with hybrid active noise cancelling, luxurious memory-foam earcups and 30 hours battery life.',
    images: [
      'https://picsum.photos/seed/headphone1/1000/1000',
      'https://picsum.photos/seed/headphone2/1000/1000',
      'https://picsum.photos/seed/headphone3/1000/1000',
    ],
    category: 'Audio',
    rating: 4.8,
    sku: 'AU-HEAD-001',
    stock: 24,
    colors: [
      { id: 'c_black', name: 'Black', hex: '#0B0B0B', available: true },
      { id: 'c_silver', name: 'Silver', hex: '#CFCFCF', available: true },
      { id: 'c_white', name: 'White', hex: '#F5F5F5', available: false },
    ],
    defaultColorId: 'c_black',
    noiseOptions: ['ANC', 'Transparency', 'None'],
    defaultNoiseOption: 'ANC',
    productInformation:
      'Drivers: 40mm dynamic drivers. Bluetooth 5.2. Supports AAC/aptX. Built-in microphone for calls. Folding hinge for travel.',
    shippingAndReturn:
      'Free standard shipping (3-7 business days). 30-day return policy. Return items must be in original packaging and in good condition.',
    specs: {
      'Battery life': '30 hours',
      Charging: 'USB-C (2 hrs fast charge)',
      Weight: '260 g',
      'Frequency response': '10Hz - 22kHz',
    },
  },

  {
    id: '2',
    name: 'Pulse Smart Watch',
    price: 120.0,
    description:
      'Lightweight smartwatch with continuous heart-rate monitoring, sleep tracking and water resistance for everyday use.',
    images: [
      'https://picsum.photos/seed/watch1/1000/1000',
      'https://picsum.photos/seed/watch2/1000/1000',
      'https://picsum.photos/seed/watch3/1000/1000',
    ],
    category: 'Wearables',
    rating: 4.2,
    sku: 'PL-SW-002',
    stock: 86,
    colors: [
      { id: 'c_black', name: 'Black', hex: '#111111', available: true },
      { id: 'c_sky', name: 'Sky Blue', hex: '#A6DAFF', available: true },
      { id: 'c_gray', name: 'Gray', hex: '#9A9A9A', available: true },
    ],
    defaultColorId: 'c_sky',
    noiseOptions: [],
    defaultNoiseOption: null,
    productInformation:
      '1.4" AMOLED display, built-in GPS, 7-day battery in typical use, supports 5 sport modes and notifications.',
    shippingAndReturn:
      'Standard shipping: 4-8 business days. 14-day return window for change of mind; opened electronics may be subject to restocking fee.',
    specs: {
      Screen: '1.4 inch AMOLED',
      Battery: '7 days (typical)',
      'Water resistance': '5 ATM',
      Weight: '36 g',
    },
  },

  {
    id: '3',
    name: 'Orbit Bluetooth Speaker',
    price: 75.5,
    description:
      'Portable speaker with 360° sound, punchy bass and IPX5 water resistance — great for indoor/outdoor listening.',
    images: [
      'https://picsum.photos/seed/speaker1/1000/1000',
      'https://picsum.photos/seed/speaker2/1000/1000',
      'https://picsum.photos/seed/speaker3/1000/1000',
    ],
    category: 'Audio',
    rating: 4.4,
    sku: 'OR-SPK-003',
    stock: 50,
    colors: [
      { id: 'c_blue', name: 'Blue', hex: '#7EC8E3', available: true },
      { id: 'c_black', name: 'Black', hex: '#1A1A1A', available: true },
    ],
    defaultColorId: 'c_blue',
    noiseOptions: [],
    defaultNoiseOption: null,
    productInformation:
      'Built-in DSP for clear mids and highs, dual passive radiators for deep bass, Bluetooth 5.0 and AUX input.',
    shippingAndReturn:
      'Ships within 1-2 business days. 30-day returns accepted; buyer pays return shipping unless defective.',
    specs: {
      Playtime: '12 hours',
      Power: '20W RMS',
      'IP rating': 'IPX5',
      Weight: '860 g',
    },
  },

  {
    id: '4',
    name: 'Striker Gaming Mouse',
    price: 40.0,
    description:
      'Ergonomic gaming mouse with adjustable DPI, RGB lighting and low-latency wireless option.',
    images: [
      'https://picsum.photos/seed/mouse1/1000/1000',
      'https://picsum.photos/seed/mouse2/1000/1000',
    ],
    category: 'Peripherals',
    rating: 4.1,
    sku: 'STR-MSE-004',
    stock: 150,
    colors: [
      { id: 'c_black', name: 'Black', hex: '#000000', available: true },
      { id: 'c_white', name: 'White', hex: '#F3F3F3', available: true },
    ],
    defaultColorId: 'c_black',
    noiseOptions: [],
    defaultNoiseOption: null,
    productInformation:
      'Optical sensor up to 16000 DPI, programmable buttons, braided cable, onboard memory for macros.',
    shippingAndReturn:
      '2-5 business days shipping. 14-day return policy for unused items. Warranty: 1 year manufacturer.',
    specs: {
      DPI: '800 - 16000',
      Buttons: '7 programmable',
      Connection: 'Wired / 2.4GHz wireless',
      Weight: '95 g',
    },
  },

  {
    id: '5',
    name: 'Nova Mechanical Keyboard',
    price: 99.0,
    description:
      'Compact 75% mechanical keyboard with hot-swappable switches, white backlight and solid aluminum frame.',
    images: [
      'https://picsum.photos/seed/keyboard1/1000/1000',
      'https://picsum.photos/seed/keyboard2/1000/1000',
      'https://picsum.photos/seed/keyboard3/1000/1000',
    ],
    category: 'Peripherals',
    rating: 4.6,
    sku: 'NOVA-KB-005',
    stock: 40,
    colors: [
      { id: 'c_gray', name: 'Gray', hex: '#D9D9D9', available: true },
      { id: 'c_black', name: 'Black', hex: '#0F0F0F', available: true },
    ],
    defaultColorId: 'c_gray',
    noiseOptions: [],
    defaultNoiseOption: null,
    productInformation:
      '75% layout, hot-swap PCB supporting 3-pin/5-pin switches, USB-C wired, aluminum top plate.',
    shippingAndReturn:
      'Standard shipping & 30-day return (item must be in original condition). 2-year limited warranty on defects.',
    specs: {
      Layout: '75%',
      Switch: 'Hot-swappable',
      Connection: 'USB-C',
      Weight: '820 g',
    },
  },
];

export default sampleProducts;
